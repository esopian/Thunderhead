define(function(){
    return {

        "st_listContainers" : { service: "storage", command: 'listContainers', example: 'st_listContainers.js', request: {
        } },
        "st_accountDetails" : { service: "storage", command: 'accountDetails', example: 'st_accountDetails.js', request: {
        } },
        "st_containerDetails" : { service: "storage", command: 'containerDetails', example: 'st_containerDetails.js', request: {
            container : '<container_name>'
        } },
        "st_createContainer" : { service: "storage", command: 'createContainer', example: 'st_createContainer.js', request: {
            container : '<container_name>'
        } },
        "st_deleteContainer" : { service: "storage", command: 'deleteContainer', example: 'st_deleteContainer.js', request: {
            container : '<container_name>'
        } },
        "st_editContainerMeta" : { service: "storage", command: 'editContainerMeta', example: 'st_editContainerMeta.js', request: {
            container : '<container_name>',
            meta      : '<meta_data>'
        } },
        "st_getContainerMeta" : { service: "storage", command: 'getContainerMeta', example: 'st_getContainerMeta.js', request: {
            container : '<container_name>'
        } },
        "st_listObjects" : { service: "storage", command: 'listObjects', example: 'st_listObjects.js', request: {
            container : '<container_name>'
        } },
        "st_getObject" : { service: "storage", command: 'getObject', example: 'st_getObject.js', request: {
            container : '<container_name>',
            object    : '<object_name>'
        } },
        "st_putObject" : { service: "storage", command: 'putObject', example: 'st_putObject.js', request: {
            container : '<container_name>',
            object    : '<object_name>',
            data      : '<object_data>'
        } },
        "st_copyObject" : { service: "storage", command: 'copyObject', example: 'st_copyObject.js', request: {
            sourceContainer      : '<source_container_name>',
            sourceObject         : '<source_object_name>',
            destinationContainer : '<destination_container_name>',
            destinationObject    : '<destination_object_name>'
        } },
        "st_deleteObject" : { service: "storage", command: 'deleteObject', example: 'st_deleteObject.js', request: {
            container : '<container_name>',
            object    : '<object_name>'
        } },
        "st_getObjectMeta" : { service: "storage", command: 'getObjectMeta', example: 'st_getObjectMeta.js',  request: {
            container : '<container_name>',
            object    : '<object_name>'
        } },
        "st_editObjectMeta" : { service: "storage", command: 'editObjectMeta', example: 'st_editObjectMeta.js', request: {
            container : '<container_name>',
            object    : '<object_name>',
            meta      : '<meta_data>'
        } },
        "st_setContainerCORS" : { service: "storage", command: 'setContainerCORS', example: 'st_setContainerCORS.js', request: {
            container : '<container_name>'
        } },
        "st_enableAccessLog" : { service: "storage", command: 'enableAccessLog', example: 'st_enableAccessLog.js', request: {
            container : '<container_name>'
        } },
        "st_disableAccessLog" : { service: "storage", command: 'disableAccessLog', example: 'st_disableAccessLog.js', request: {
            container : '<container_name>'
        } },
        "st_putCompressedObject" : { service: "storage", command: 'putCompressedObject', example: 'st_putCompressedObject.js', request: {
            container : '<container_name>',
            object    : '<object_name>',
            data      : '<object_data>',
            compress  : true
        } },
        "st_copyObjectWithHeaders" : { service: "storage", command: 'copyObjectWithHeaders', example: 'st_copyObjectWithHeaders.js', request: {
            sourceContainer      : '<source_container_name>',
            sourceObject         : '<source_object_name>',
            destinationContainer : '<destination_container_name>',
            destinationObject    : '<destination_object_name>'
        } },
        "st_emptyContainer" : { service: "storage", command: 'emptyContainer', example: 'st_emptyContainer.js', request: {
            container : '<container_name>'
        } },
        "st_syncDir" : { service: "storage", command: 'syncDir', example: 'st_syncDir.js', request: {
            container : '<container_name>',
            directory : '<directory_name>'
        } },


        "dns_listLimits" : { service: "dns", command: "listLimits", example: "dns_listLimits.js", request: {
            // type : '<limit_type>'
        } },
        "dns_listLimitTypes" : { service: "dns", command: "listLimitTypes", example: "dns_listLimitTypes.js", request: {
        } },
        "dns_listDomains" : { service: "dns", command: "listDomains", example: "dns_listDomains.js", request: {
        } },
        "dns_listSubdomains" : { service: "dns", command: "listSubdomains", example: "dns_listSubdomains.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_listDomainDetails" : { service: "dns", command: "listDomainDetails", example: "dns_listDomainDetails.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_listDomainChanges" : { service: "dns", command: "listDomainChanges", example: "dns_listDomainChanges.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_exportDomain" : { service: "dns", command: "exportDomain", example: "dns_exportDomain.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_importDomain" : { service: "dns", command: "importDomain", example: "dns_importDomain.js", request: {
            contents : '<contents>'
        } },
        "dns_createDomain" : { service: "dns", command: "createDomain", example: "dns_createDomain.js", request: {
            name         : 'example.com',
            emailAddress : 'domains@example.com',
            ttl          : 900,
            recordsList  : {
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
        } },
        "dns_deleteDomain" : { service: "dns", command: "deleteDomain", example: "dns_deleteDomain.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_editDomain" : { service: "dns", command: "editDomain", example: "dns_editDomain.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_listRecords" : { service: "dns", command: "listRecords", example: "dns_listRecords.js", request: {
            domainId : '<domain_id>'
        } },
        "dns_listRecordDetails" : { service: "dns", command: "listRecordDetails", example: "dns_listRecordDetails.js", request: {
            domainId : '<domain_id>',
            recordId : '<record_id>'
        } },
        "dns_createRecord" : { service: "dns", command: "createRecord", example: "dns_createRecord.js", request: {
            domainId : '<domain_id>',
            type     : '<type>',
            name     : '<name>',
            data     : '<data>'
        } },
        "dns_editRecord" : { service: "dns", command: "editRecord", example: "dns_editRecord.js", request: {
            domainId : '<domain_id>',
            recordId : '<record_id>',
            type     : '<type>',
            name     : '<name>',
            data     : '<data>'
        } },
        "dns_deleteRecord" : { service: "dns", command: "deleteRecord", example: "dns_deleteRecord.js", request: {
            domainId : '<domain_id>',
            recordId : '<record_id>'
        } },



        "lb_listLimits" : { service: 'lb', command: 'listLimits', example: 'lb_listLimits.js', request: {
        } },
        "lb_listAllowedDomains" : { service: 'lb', command: 'listAllowedDomains', example: 'lb_listAllowedDomains.js', request: {
        } },
        "lb_listAbsoluteLimits" : { service: 'lb', command: 'listAbsoluteLimits', example: 'lb_listAbsoluteLimits.js', request: {
        } },
        "lb_listLB" : { service: 'lb', command: 'listLB', example: 'lb_listLB.js', request: {
        } },
        "lb_getSSLDetails" : { service: 'lb', command: 'getSSLDetails', example: 'lb_getSSLDetails.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },
        "lb_listLBDetails" : { service: 'lb', command: 'listLBDetails', example: 'lb_listLBDetails.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },
        "lb_createLB" : { service: 'lb', command: 'createLB', example: 'lb_createLB.js', request: {
            'name'       : 'a-new-loadbalancer',
            'protocol'   : 'HTTP',
            'virtualIps' : [
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
        } },
        "lb_editLB" : { service: 'lb', command: 'editLB', example: 'lb_editLB.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },
        "lb_deleteLB" : { service: 'lb', command: 'deleteLB', example: 'lb_deleteLB.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },
        "lb_addNode" : { service: 'lb', command: 'addNode', example: 'lb_addNode.js', request: {
            loadBalancerId : "<load_balancer_id",
            address        : '',
            condition      : '',
            port           : ''
        } },
        "lb_getHealthMonitorLB" : { service: 'lb', command: 'getHealthMonitorLB', example: 'lb_getHealthMonitorLB.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },
        "lb_editHealthMonitorLB" : { service: 'lb', command: 'editHealthMonitorLB', example: 'lb_editHealthMonitorLB.js', request: {
            loadBalancerId             : "<load_balancer_id",
            attemptsBeforeDeactivation : 3,
            delay                      : 500,
            timeout                    : 1000,
            type                       : ''
        } },
        "lb_deleteHealthMonitorLB" : { service: 'lb', command: 'deleteHealthMonitorLB', example: 'lb_deleteHealthMonitorLB.js', request: {
            loadBalancerId : "<load_balancer_id"
        } },


        "cdn_listContainers" : { service: 'cdn', command: 'listContainers', example: 'cdn_listContainers.js', request: {
            enabled_only : true,
            limit        : null,
            marker       : null,
            end_marker   : null
        }},
        "cdn_getContainerMeta" : { service: 'cdn', command: 'getContainerMeta', example: 'cdn_getContainerMeta.js', request: {
            container : ''
        }},
        "cdn_editContainerMeta" : { service: 'cdn', command: 'editContainerMeta', example: 'cdn_editContainerMeta.js', request: {
            container : '',
            meta      : ''
        }},
        "cdn_enableContainer" : { service: 'cdn', command: 'enableContainer', example: 'cdn_enableContainer.js', request: {
            container : ''
        }},
        "cdn_disableContainer" : { service: 'cdn', command: 'disableContainer', example: 'cdn_disableContainer.js', request: {
            container : ''
        }},
        "cdn_purgeObject" : { service: 'cdn', command: 'purgeObject', example: 'cdn_purgeObject.js', request: {
            container : '',
            object    : ''
        }},
        "cdn_enableLog" : { service: 'cdn', command: 'enableLog', example: 'cdn_enableLog.js', request: {
            container : ''
        }},
        "cdn_disableLog" : { service: 'cdn', command: 'disableLog', example: 'cdn_disableLog.js', request: {
            container : ''
        }}

    };
});
