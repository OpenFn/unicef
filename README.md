# UNICEF Cambodia

Repository to manage OpenFn jobs to integrate the open-source UNICEF [**Primero**](https://www.primero.org/) and [**OSCaR**](https://oscarhq.com/) systems for secure data and referrals exchange.

### Note! Commits to master will deploy automatically to OpenFn.org. 

## About the integration
Two integration flows have been implemented to facilitate a bi-directional sync between the Primero and OSCaR systems to share relevant case and referral data between systems. This is to support the following functional requirements.

_**Flow 1: Primero cases --> OSCaR**_
* User Story 1: Generating government Referrals 

_**Flow 2: OSCaR cases --> Primero**_
* User Story 2: View OSCaR cases in Primero 
* User Story 4: Sending referrals to Primero

## About the OpenFn jobs
To achieve the bi-direction sync, 4 OpenFn jobs have been implemented. On a timer-basis, these jobs will execute to ensure regular data syncs, but this flows may also be executed on-demand at any time by a designated OpenFn admin user.

### APIs
These jobs were designed using:
* Primero: [API v1.1](https://docs.google.com/document/d/1jpaT2_UBBnc3PxPYlLMBEzNUkyfuxRZiksywG5MKM0Q/edit?usp=sharing)
* OSCaR: [API v1.0.0](https://app.swaggerhub.com/apis/Ro51/OSCaRInterop/1.0.0#/info). 

**This project leverages OpenFn adaptor [language-primero](https://github.com/OpenFn/language-primero)** for quicker job-writing and helper functions.

### Flows

_**Flow 1: Primero cases --> OSCaR**_
1. [f1-j1-getPrimeroCases.js](https://github.com/OpenFn/unicef-cambodia/blob/master/jobs/f1-j1-getPrimeroCases.js)
2. [f1-j2-casesToOscar.js](https://github.com/OpenFn/unicef-cambodia/blob/master/jobs/f1-j2-casesToOscar.js)

_**Flow 2: OSCaR cases --> Primero**_
1. [f2-j1-getOscarCases.js](https://github.com/OpenFn/unicef-cambodia/blob/master/jobs/f2-j1-getOscarCases.js)
2. [f2-j2-upsertCasesToPrimero.js](https://github.com/OpenFn/unicef-cambodia/blob/master/jobs/f2-j2-upsertCasesToPrimero.js)


### Flow Triggers
On a ++timer-basis++ OpenFn will send the below HTTP GET requests to the Primero and OSCaR systems to fetch updated case information and new referrals. 
_**Flow 1: Primero cases --> OSCaR**_

<!--`GET ... ` -->
List cases where: 
1. New referrals have been created (indicated by Primero field `transitions_created_at`).
2. Case updates made since the last OpenFn request, indicated by Primero field `transitions_changed_at`. (Note: This happens if the case owner, case owner’s phone, case owner’s Agency, or the Service Implemented On fields are changed.) 

_Example Request_
``` 
GET /api/cases?remote=true&scope[or][transitions_created_at]=or_op||date_range||07-05-2020.01-01-4020&scope[or][transitions_changed_at]=or_op||date_range||07-05-2020 00:40.01-01-4020 03:00&scope[service_response_types]=list||referral_to_oscar 
```

_**Flow 2: OSCaR cases --> Primero**_

<!--`GET ... ` -->
List cases where
1. New external referrals have been created. 
2. Case updates made sinc the last OpenFn request. 
_Example Request_
```
 GET /api/v1/organizations/clients
```

### Flow Mappings & Transformations
<Placeholder - To Discuss>

## Questions about this implementation? 
Contact aleksa@openfn.org for more information. 

<Administrator details> 


