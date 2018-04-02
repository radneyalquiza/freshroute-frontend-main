// Import Vue
import Vue from 'vue'

let Model = {
    "AppUsers": [{
            "UserName": "atlaswing",
            "Id": 1,
            "Email": "atlaswingpasaway@hotmail.com",
            "Password": "qwe123123",
            "_encryptPassword": "oith2390gu43089gu23089gu29g8243",
            "FirstName": "Radney",
            "LastName": "Alquiza",
            "clients": null
        },
        {
            "UserName": "atlaswing2",
            "Id": 2,
            "Email": "contact@aaronalquiza.com",
            "Password": "qwe123123",
            "_encryptPassword": "oith2390guasd1221122112u29g8243",
            "FirstName": "Aaron1",
            "LastName": "Alquiza1",
            "clients": null
        },
        {
            "UserName": "jbrettler",
            "Id": 1002,
            "Email": "jacobbrettler@gmail.com",
            "Password": "qwe123123",
            "_encryptPassword": "dfsg3q54h4u64wjtrihaerhg45uy456",
            "FirstName": "Jacob",
            "LastName": "Brettler",
            "AppClients": [{
                    "Id": 1,
                    "Email": "a@a.com",
                    "FirstName": "David",
                    "LastName": "Yu",
                    "Phone": "647-292-1759",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 1,
                        "AppClientId": 1,
                        "City": "Toronto",
                        "PostalCode": "L4J 5G3",
                        "Street": "131 Joanna Crescent",
                        "lat": 43.8038666,
                        "lng": -79.42593219999999,
                        "AppServices": [{
                            "Id": 1,
                            "AppAddressId": 1,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "20.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 2,
                    "Email": "a@a.com",
                    "FirstName": "Jenny",
                    "LastName": "",
                    "Phone": "647-333-4444",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                            "Id": 2,
                            "AppClientId": 2,
                            "City": "Toronto",
                            "PostalCode": "L4J 5E9",
                            "Street": "66 Joanna Cr",
                            "lat": 43.80478666,
                            "lng": -79.4267437,
                            "AppServices": [{
                                "Id": 2,
                                "AppAddressId": 2,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "20.00"
                            }]
                        },
                        {
                            "Id": 6,
                            "AppClientId": 2,
                            "City": "Vaughan",
                            "PostalCode": "L4J 1G1",
                            "Street": "3 Centre Street",
                            "lat": 43.8160999,
                            "lng": -79.4274989,
                            "AppServices": [{
                                "Id": 7,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "ETRANS",
                                "AppServiceType": "WEED",
                                "Price": "20.00"
                            }]
                        }
                    ],
                    "AppUser": null
                },
                {
                    "Id": 3,
                    "Email": "a@a.com",
                    "FirstName": "Michael",
                    "LastName": "Leung",
                    "Phone": "647-555-6666",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 3,
                        "AppClientId": 3,
                        "City": "Toronto",
                        "PostalCode": "M2M 2W8",
                        "Street": "39 Arran Crescent",
                        "lat": 43.8160999,
                        "lng": -79.4274989,
                        "AppServices": [{
                                "Id": 3,
                                "AppAddressId": 3,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "30.00"
                            },
                            {
                                "Id": 6,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "CHEQUE",
                                "AppServiceType": "WEED",
                                "Price": "30.00"
                            }
                        ]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 4,
                    "Email": "a@a.com",
                    "FirstName": "SK",
                    "LastName": "Ho",
                    "Phone": "647-111-2222",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 4,
                        "AppClientId": 4,
                        "City": "Toronto",
                        "PostalCode": "L3T 1E9",
                        "Street": "124 Woodward Avenue",
                        "lat": 43.8025869,
                        "lng": -79.4117149,
                        "AppServices": [{
                            "Id": 4,
                            "AppAddressId": 4,
                            "Frequency": "Weekly/Bi-Weekly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 5,
                    "Email": "a@a.com",
                    "FirstName": "Dr. Abbas",
                    "LastName": "Azadian",
                    "Phone": "416-737-6129",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 5,
                        "AppClientId": 5,
                        "City": "Toronto",
                        "PostalCode": "L3T",
                        "Street": "7560 Bayview Ave",
                        "lat": 43.8165433,
                        "lng": -79.4030897,
                        "AppServices": [{
                            "Id": 5,
                            "AppAddressId": 5,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                }
            ]
        },



        {
            "UserName": "seth",
            "Id": 1002,
            "Email": "jacobbrettler@gmail.com",
            "Password": "qwe123123",
            "_encryptPassword": "dfsg3q54h4u64wjtrihaerhg45uy456",
            "FirstName": "Seth",
            "LastName": "",
            "AppClients": [{
                    "Id": 1,
                    "Email": "a@a.com",
                    "FirstName": "David",
                    "LastName": "Yu",
                    "Phone": "647-292-1759",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 1,
                        "AppClientId": 1,
                        "City": "Toronto",
                        "PostalCode": "L4J 5G3",
                        "Street": "131 Joanna Crescent",
                        "lat": 43.8038666,
                        "lng": -79.42593219999999,
                        "AppServices": [{
                            "Id": 1,
                            "AppAddressId": 1,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "20.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 2,
                    "Email": "a@a.com",
                    "FirstName": "Jenny",
                    "LastName": "",
                    "Phone": "647-333-4444",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                            "Id": 2,
                            "AppClientId": 2,
                            "City": "Toronto",
                            "PostalCode": "L4J 5E9",
                            "Street": "66 Joanna Cr",
                            "lat": 43.80478666,
                            "lng": -79.4267437,
                            "AppServices": [{
                                "Id": 2,
                                "AppAddressId": 2,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "20.00"
                            }]
                        },
                        {
                            "Id": 6,
                            "AppClientId": 2,
                            "City": "Vaughan",
                            "PostalCode": "L4J 1G1",
                            "Street": "3 Centre Street",
                            "lat": 43.8160999,
                            "lng": -79.4274989,
                            "AppServices": [{
                                "Id": 7,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "ETRANS",
                                "AppServiceType": "WEED",
                                "Price": "20.00"
                            }]
                        }
                    ],
                    "AppUser": null
                },
                {
                    "Id": 3,
                    "Email": "a@a.com",
                    "FirstName": "Michael",
                    "LastName": "Leung",
                    "Phone": "647-555-6666",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 3,
                        "AppClientId": 3,
                        "City": "Toronto",
                        "PostalCode": "M2M 2W8",
                        "Street": "39 Arran Crescent",
                        "lat": 43.8160999,
                        "lng": -79.4274989,
                        "AppServices": [{
                                "Id": 3,
                                "AppAddressId": 3,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "30.00"
                            },
                            {
                                "Id": 6,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "CHEQUE",
                                "AppServiceType": "WEED",
                                "Price": "30.00"
                            }
                        ]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 4,
                    "Email": "a@a.com",
                    "FirstName": "SK",
                    "LastName": "Ho",
                    "Phone": "647-111-2222",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 4,
                        "AppClientId": 4,
                        "City": "Toronto",
                        "PostalCode": "L3T 1E9",
                        "Street": "124 Woodward Avenue",
                        "lat": 43.8025869,
                        "lng": -79.4117149,
                        "AppServices": [{
                            "Id": 4,
                            "AppAddressId": 4,
                            "Frequency": "Weekly/Bi-Weekly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 5,
                    "Email": "a@a.com",
                    "FirstName": "Dr. Abbas",
                    "LastName": "Azadian",
                    "Phone": "416-737-6129",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 5,
                        "AppClientId": 5,
                        "City": "Toronto",
                        "PostalCode": "L3T",
                        "Street": "7560 Bayview Ave",
                        "lat": 43.8165433,
                        "lng": -79.4030897,
                        "AppServices": [{
                            "Id": 5,
                            "AppAddressId": 5,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                }
            ]
        },

        {
            "UserName": "brian",
            "Id": 1002,
            "Email": "jacobbrettler@gmail.com",
            "Password": "qwe123123",
            "_encryptPassword": "dfsg3q54h4u64wjtrihaerhg45uy456",
            "FirstName": "Brian",
            "LastName": "",
            "AppClients": [{
                    "Id": 1,
                    "Email": "a@a.com",
                    "FirstName": "David",
                    "LastName": "Yu",
                    "Phone": "647-292-1759",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 1,
                        "AppClientId": 1,
                        "City": "Toronto",
                        "PostalCode": "L4J 5G3",
                        "Street": "131 Joanna Crescent",
                        "lat": 43.8038666,
                        "lng": -79.42593219999999,
                        "AppServices": [{
                            "Id": 1,
                            "AppAddressId": 1,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "20.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 2,
                    "Email": "a@a.com",
                    "FirstName": "Jenny",
                    "LastName": "",
                    "Phone": "647-333-4444",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                            "Id": 2,
                            "AppClientId": 2,
                            "City": "Toronto",
                            "PostalCode": "L4J 5E9",
                            "Street": "66 Joanna Cr",
                            "lat": 43.80478666,
                            "lng": -79.4267437,
                            "AppServices": [{
                                "Id": 2,
                                "AppAddressId": 2,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "20.00"
                            }]
                        },
                        {
                            "Id": 6,
                            "AppClientId": 2,
                            "City": "Vaughan",
                            "PostalCode": "L4J 1G1",
                            "Street": "3 Centre Street",
                            "lat": 43.8160999,
                            "lng": -79.4274989,
                            "AppServices": [{
                                "Id": 7,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "ETRANS",
                                "AppServiceType": "WEED",
                                "Price": "20.00"
                            }]
                        }
                    ],
                    "AppUser": null
                },
                {
                    "Id": 3,
                    "Email": "a@a.com",
                    "FirstName": "Michael",
                    "LastName": "Leung",
                    "Phone": "647-555-6666",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 3,
                        "AppClientId": 3,
                        "City": "Toronto",
                        "PostalCode": "M2M 2W8",
                        "Street": "39 Arran Crescent",
                        "lat": 43.8160999,
                        "lng": -79.4274989,
                        "AppServices": [{
                                "Id": 3,
                                "AppAddressId": 3,
                                "Frequency": "Weekly/Bi-Monthly",
                                "PaymentMethod": "CASH",
                                "AppServiceType": "CUT",
                                "Price": "30.00"
                            },
                            {
                                "Id": 6,
                                "AppAddressId": 6,
                                "Frequency": "Weekly/Bi-Weekly",
                                "PaymentMethod": "CHEQUE",
                                "AppServiceType": "WEED",
                                "Price": "30.00"
                            }
                        ]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 4,
                    "Email": "a@a.com",
                    "FirstName": "SK",
                    "LastName": "Ho",
                    "Phone": "647-111-2222",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 4,
                        "AppClientId": 4,
                        "City": "Toronto",
                        "PostalCode": "L3T 1E9",
                        "Street": "124 Woodward Avenue",
                        "lat": 43.8025869,
                        "lng": -79.4117149,
                        "AppServices": [{
                            "Id": 4,
                            "AppAddressId": 4,
                            "Frequency": "Weekly/Bi-Weekly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                },
                {
                    "Id": 5,
                    "Email": "a@a.com",
                    "FirstName": "Dr. Abbas",
                    "LastName": "Azadian",
                    "Phone": "416-737-6129",
                    "AppUserId": 1002,
                    "AppAddresses": [{
                        "Id": 5,
                        "AppClientId": 5,
                        "City": "Toronto",
                        "PostalCode": "L3T",
                        "Street": "7560 Bayview Ave",
                        "lat": 43.8165433,
                        "lng": -79.4030897,
                        "AppServices": [{
                            "Id": 5,
                            "AppAddressId": 5,
                            "Frequency": "Weekly/Bi-Monthly",
                            "PaymentMethod": "CASH",
                            "AppServiceType": "CUT",
                            "Price": "30.00"
                        }]
                    }],
                    "AppUser": null
                }
            ]
        }

    ]
}

export default Model;

// let SharedModel = new Vue({ data: Model });
// SharedModel.install = function() {
//     Object.defineProperty(Vue.prototype, "$Global", {
//         get() { return Model }
//     });
// }
// export default SharedModel;