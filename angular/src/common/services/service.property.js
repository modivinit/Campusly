angular.module('service.property', ['service.firebase'])

    .filter('loadBid', ['propertyService',
    function (propertyService)
    {
        return function (bids,limit)
        {
            bids= bids || [];
            bids= bids.slice(0,limit||bids.length);

            bids.forEach(function (bid,idx)
            {
                if (_.keys(bid).length>1) return;

                propertyService.fetchBid(bid.$id,bid)
                .$inst().$ref().on('value',function (data)
                { 
                    _.extend(bid,data.val());
                });
            });

            return bids;
        };
    }])

    .filter('loadProperty', ['propertyService',
    function (propertyService)
    {
        return function (ids,state,lazy)
        {
            ids= ids || [];
            lazy= !!lazy;

            ids.forEach(function (property,idx)
            {
                if (_.keys(property).length>1) return;

                var obj= propertyService.fetchWithBids(property.$id,property,lazy);
                    
                obj.$inst().$ref().on('value',function (data)
                { 
                    _.extend(property,lazy ? { pictures: [data.val()] } : data.val());
                });
            });

            if (state)
              return _.filter(ids,
                     function (p)
                     {
                        return !(p.tenant&&state=='active'
                              ||state=='rented'&&!p.tenant)
                     });
            else
              return ids;
        };
    }])


    .factory('propertyService', ["$rootScope", "firebaseRef", "syncData", 'uuid4', 'firebaseBatch', 'loginService', function($rootScope, firebaseRef, syncData,uuid4,firebaseBatch,loginService){
        return {
            create: function ()
            {
                return syncData('properties/'+uuid4.generate()).$asObject();
            },
            list : function(limit) {
                return syncData('properties',limit).$asArray();
            },
            featured: function(){
                return syncData('featured').$asArray();
            },
            fetch: function(propertyId,identity,lazy){
                var that= this, property;

                if (lazy)
                {
                    property= syncData('properties/'+propertyId+'/pictures/0').$asObject();

                    syncData('properties/'+propertyId+'/tenant').$asObject()
                    .$inst().$ref().on('value',_.debounce(function (data)
                    {
                        var id= data.val();

                        if (id&&$rootScope.profile&&typeof id=='string')
                        {
                            var tenant= loginService.fetchProfile(id);

                            identity ? identity.tenant= tenant: property.tenant= tenant;
                        }
                    },200));

                    syncData('properties/'+propertyId+'/owner').$asObject()
                    .$inst().$ref().on('value',_.debounce(function (data)
                    {
                        var id= data.val();

                        identity ? identity.owner= id: property.owner= id;
                    },200));

                    syncData('properties/'+propertyId+'/address').$asObject()
                    .$inst().$ref().on('value',_.debounce(function (data)
                    {
                        identity ? identity.address= data.val(): property.address= data.val();
                    },200));

                    syncData('watchers/'+propertyId).$asObject()
                    .$inst().$ref().on('value',_.debounce(function (data)
                    {
                        identity ? identity.watchers= _.keys(data.val()) : property.watchers= _.keys(data.val());
                    },200));
                }
                else
                {
                    property= syncData('properties/'+propertyId).$asObject();

                    property.$inst().$ref().on('value',_.debounce(function (data)
                    {
                          var val= data.val();

                          if (val&&$rootScope.profile&&typeof val.tenant=='string')
                          {
                            var tenant= loginService.fetchProfile(val.tenant);

                            identity ? identity.tenant= tenant: property.tenant= tenant;
                          }

                          syncData('watchers/'+propertyId).$asObject()
                           .$inst().$ref().on('value',_.debounce(function (data)
                          {
                                identity ? identity.watchers= _.keys(data.val()) : property.watchers= _.keys(data.val());
                          },200));

                    },200));

                }

                return property;
            },
            fetchWithBids: function(propertyId,identity,lazy){
                var that= this,
                    property= that.fetch(propertyId,identity,lazy);

                property.$inst().$ref().on('value',_.debounce(function (data)
                {
                    var val= data.val();

                    if (val)
                    that.fetchBids(propertyId)
                    .$inst().$ref().on('value',function (data)
                    {
                         var bids= _.map(_.keys(data.val()),function ($id) { return { $id: $id }; });

                         val.bids= identity ? identity.bids= bids : property.bids= bids;

                         if (bids.length)
                           that.fetchBid(bids[0].$id)
                             .$inst().$ref().on('value',function (data)
                             { 
                                  val.bestOffer= identity ? identity.bestOffer= data.val() : property.bestOffer= data.val();
                                  if (val.bestOffer)
                                    val.bestOffer.$id= data.name();
                             });
                    });
                },200));
                
                return property;
            },
            fetchBid: function(bidId,identity){
                var bid= syncData('bids/all/'+bidId).$asObject();

                bid
                 .$inst().$ref().on('value',function (data)
                 { 
                      var val= data.val(); 

                      if (val&&$rootScope.profile)
                      {
                           var user= loginService.fetchProfile(val.userId);

                           identity ? identity.user= user : bid.user= user;
                      }
                 });

                return bid;
            },
            fetchBids: function(propertyId,limit){
                return syncData('bids/property/'+propertyId,limit).$asArray();
            },
            fetchRecentlyBiddedProperties: function(userId,limit){
                return syncData('bids/user/'+userId,limit).$asArray();
            },
            placeBid : function(propertyId, ownerId, userId, bid, cb){
                var bidId= uuid4.generate(),
                    time= new Date().getTime();

                bid.propertyId= propertyId;
                bid.userId= userId;

                firebaseBatch
                ([
                      { 
                         path: ['bids', 'all', bidId],
                         data: bid,
                         priority: -time // lets sort them by time descending
                      },
                      { 
                         path: ['bids', 'property', propertyId, bidId],
                         data: true, 
                         priority: -bid.rentAmount // need to be sorted by amount descending to easy get the best
                      },
                      { 
                         path: ['bids', 'user', userId, propertyId],
                         data: bidId,
                         priority: -time // move up the last bidded property property
                      },
                      { 
                         path: ['bids', 'user', ownerId, propertyId],
                         data: bidId,
                         priority: -time // move up the last bidded property property
                      },
                      { 
                         path: ['bids', 'security', ownerId, userId],
                         data: bidId,
                         priority: -time // move up the last bidded property property
                      }
                ],
                function (err)
                {
                     if (err)
                       cb(err);
                     else
                     {
                       bid.$id= bidId;
                       cb(null,bidId);
                     }
                });

            },
            editBid: function(bid, property, cb)
            {
                var time= new Date().getTime();

                firebaseBatch
                ([
                      { 
                         path: ['bids', 'all', bid.$id],
                         data: _.omit(bid,['$id']),
                         priority: -time // lets move up because it is changed
                      },
                      { 
                         path: ['bids', 'property', property.$id, bid.$id],
                         data: true, 
                         priority: -bid.rentAmount // resort the amount
                      },
                      { 
                         path: ['bids', 'user', bid.userId, property.$id],
                         data: true,
                         priority: -time // move up the last bidded property property
                      },
                      { 
                         path: ['bids', 'user', property.owner, property.$id],
                         data: true,
                         priority: -time // move up the last bidded property property
                      },
                ],
                cb);

            },
            cancelBid: function(bid, property, cb)
            {
                firebaseBatch
                ([
                      { 
                         remove: ['bids', 'property', property.$id, bid.$id],
                      },
                      { 
                         remove: ['bids', 'user', bid.userId, property.$id]
                      },
                      { 
                         remove: ['bids', 'user', property.owner, bid.userId, bid.$id]
                      },
                      { 
                         remove: ['bids', 'all', bid.$id]
                      }
                ],
                cb);

            },
            acceptBid: function (bid,property,cb)
            {
                var time= new Date().getTime();

                firebaseBatch
                ([
                      { 
                         path: ['bids', 'all', bid.$id,'accepted'],
                         data: true
                      },
                      { 
                         path: ['bids', 'property', bid.propertyId, bid.$id],
                         data: true, 
                         priority: -Number.MAX_VALUE // we want it on top since it is the accepted one and should always be fetched
                      },
                      { 
                         path: ['bids', 'user', bid.userId, bid.propertyId],
                         data: true,
                         priority: -time // move up something happened
                      },
                      { 
                         path: ['bids', 'user', property.owner, bid.propertyId],
                         data: true,
                         priority: -time // move up something happened
                      }
                ],
                cb);

            },
            cancelAcceptBid: function (bid,property,cb)
            {
                var time= new Date().getTime();

                firebaseBatch
                ([
                      { 
                         remove: ['bids', 'all', bid.$id, 'accepted']
                      },
                      { 
                         path: ['bids', 'property', bid.propertyId, bid.$id],
                         data: true, 
                         priority: -bid.rentAmount // restore its position
                      },
                      { 
                         path: ['bids', 'user', bid.userId, bid.propertyId],
                         data: true,
                         priority: -time // move up something happened
                      },
                      { 
                         path: ['bids', 'user', property.owner, bid.propertyId],
                         data: true,
                         priority: -time // move up something happened
                      }
                ],
                cb);

            },
            tenantMoveIn: function (user,property,cb)
            {
                var time= new Date().getTime();

                firebaseBatch
                ([
                      { 
                         path: ['properties', property.$id,'tenant'],
                         data: user.$id
                      }
                ],
                cb);

            },
            cancelTenantMoveIn: function (user,property,cb)
            {
                firebaseBatch
                ([
                      { 
                         remove: ['properties', property.$id,'tenant']
                      }
                ],
                cb);
            },
            addWatcher: function (propertyId,userId,cb)
            {
                var time= new Date().getTime();

                firebaseBatch
                ([
                      { 
                         path: ['watchers', propertyId, userId],
                         data: true,
                         priority: -time
                      }
                ],
                cb);
            },
            removeWatcher: function (propertyId,userId,cb)
            {
                firebaseBatch
                ([
                      { 
                         remove: ['watchers', propertyId, userId]
                      }
                ],
                cb);
            },
            isActive : function(property){
                var isActive =  false;
                if(property && property.endDate){
                    isActive =  moment().isBefore(property.endDate);
                    property.status = (isActive)?"Live":"Closed";
                }
                return isActive;
            },
            getStatus : function(property){
                var isActive =  false;
                if(property && property.endDate){
                    isActive =  moment().isBefore(property.endDate);
                }
                return (isActive)?"Live":"Closed";
            },
            local : function(){
                return {
                    "propId:1": {
                        address: "2606 Wilson Street #1105",
                        city: "Austin",
                        state: "TX",
                        zip: "78704",
                        rent: "1950",
                        rentItNow : "2499",
                        area: "1588",
                        area_unit: "sq ft",
                        beds : "4",
                        baths : "3",
                        garages : "2",
                        description: "<p>4-Level townhouse style 2 bedroom 2.5 bath just 3 blocks off South Congress.</p><p>Private Rooftop Terrace for you to love and enjoying dinner and drinks high above Austin.</p><p>The place is less than 1 year old and is in pristine condition with hardwood floors.</p><p>Attached 2 car garage.</p><p>Small Pets OK!</p>",
                        amenities: [
                            {
                                uid: "1",
                                name: "Air conditioning",
                                value: true
                            },
                            {
                                uid: "2",
                                name: "Balcony",
                                value: false
                            },
                            {
                                uid: "3",
                                name: "Small pets allowed",
                                value: true
                            }
                        ]
                    },
                    "propId:2" : {
                        address: "2006 Bird Creek Dr.",
                        city: "Austin",
                        state: "TX",
                        zip: "12345",
                        rent: "925",
                        area: "1200",
                        area_unit: "sq ft",
                        beds : "2",
                        baths : "1",
                        garages : "1",
                        description: "Vestibulum feugiat tempor mattis. Maecenas venenatis at erat sit amet viverra. " +
                            "Fusce sagittis pretium est vel iaculis. Proin vel tincidunt nisi. Sed non vehicula purus. " +
                            "In auctor sodales metus, ac fermentum odio sagittis quis. Curabitur volutpat, erat nec varius " +
                            "dapibus, felis libero malesuada mauris, at vestibulum enim erat non nibh. Donec ac nibh dapibus, " +
                            "sagittis libero a, sodales enim. Quisque a viverra mi.",
                        amenities: [
                            {
                                uid: "1",
                                name: "Air conditioning",
                                value: true
                            },
                            {
                                uid: "2",
                                name: "Balcony",
                                value: false
                            }
                        ]
                    }
                };
            }
        };
    }]);
