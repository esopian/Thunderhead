define(function(){
    return {
        'listContainers' : {
            service : 'storage',
            command : 'listContainers',
            example : 'listContainers.js',
            request : {}
        },
        'getContainerMeta' : {
            service : 'storage',
            command : 'getContainerMeta',
            example : 'getContainerMeta.js',
            request : { container: '<container_name>' }
        },
        'listLimits' : {
            service : 'dns',
            command : 'listLimits',
            request : {}
        },
        'listCDNContainers' : {
            service : 'cdn',
            command : 'listContainers',
            request : {
                enabled_only : true,
                limit : null,
                marker : null,
                end_marker : null
            }
        },
        'createLB' : {
            service : 'lb',
            command : 'createLB',
            request : {
                'name': 'a-new-loadbalancer',
                'protocol': 'HTTP',
                'virtualIps': [
                    {
                        'type': 'PUBLIC'
                    }
                ],
                'nodes': [
                    {
                        'address': '10.1.1.1',
                        'port': 80,
                        'condition': 'ENABLED'
                    }
                ]
            }
        },
        'createDomain' : {
            service : 'dns',
            command : 'createDomain',
            example : 'createDomain.js',
            request : {
                name : 'example.com',
                emailAddress : 'domains@example.com',
                ttl : 900,
                recordsList : {
                    records : [
                        {
                            'ttl' : 900,
                            'name' : 'example.com',
                            'type' : 'A',
                            'data' : '10.10.10.10'
                        },
                        {
                            'ttl' : 900,
                            'name' : 'www.example.com',
                            'type' : 'A',
                            'data' : '10.10.10.10'
                        }
                    ]
                }
            }
        }
    };
});