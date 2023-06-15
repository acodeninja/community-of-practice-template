---
title: Diagramming
---

# Why diagram?

During developing a software solution engineers must communicate the place of a system within a wider portfolio, the
context of the system, and the components that make up that system. While written communication is widely used, it can 
lead to differing mental models of a software system.

This is where effective diagramming comes in, presenting abstracted contextual views of the software system. These views 
will enable technical and non-technical participants to have a shared vision of the system and aid in discussing issues
that present themselves during development.

To ensure diagrams clearly communicate the intended contextual information it's a good idea to assess diagrams for 
clarity. The [C4 Diagram Bingo card](https://c4model.com/bingo/) can make assessing diagrams more engaging.

For more information on C4 diagramming see [the C4 website](https://c4model.com/).

## Core Diagrams

The core diagrams describe the system in abstract terms and focus on the context, containers and components of the
system. C4 modelling includes more diagram types, but some place an additional maintenance burden on developers that
is not outweighed by the information conveyed.

### Context Diagram

The context diagram shows the high level parts of the system, users that interact with them, and the external or 
third-party systems integrated with the system.

Detail isn't important here as this is your zoomed out view showing a big picture of the system landscape. The focus 
should be on people (actors, roles, personas, etc) and software systems rather than technologies, protocols and other 
low-level details. It's the sort of diagram that you could show to non-technical people.

```diagram-plantuml
@startuml
'ref http://plantuml.com/stdlib
!include <C4/C4_Context>
!include <office/Users/user.puml>

title Social Care Case Management Context Diagram

Person(care_practitioners, Social Care Practitioner, "<$user> <$user>\n Adult and Children")
Person_Ext(external_referrers, External Referrers, "<$user> <$user>\n Doctors, Police, Teachers ...")
Person(data_insight_team, Data and Insight Team)

System_Boundary(system, "Social Care") {
  System(mash_referral, "MASH Referrals", "Processes incoming Referrals")
  System(social_care_cases, "Social Care Case Management", "Practitioners to manage case information.")
  System(social_care_workflows, "Core Pathways", "Practitioners to manage case workflows.")
  System_Ext(qlik, "Qlik Analytics", "ETL & Case progress reporting")
  System_Ext(google, "Google Services", "Forms\nSheets\nDocs\nGroups")
  System_Ext(social_care_finance, "Social Care Finance", "Care package management, procurement and accounting.")
}

Rel(care_practitioners, social_care_cases, "Manage cases using")
Rel(care_practitioners, qlik, "View / create dashboards and reports")
Rel(care_practitioners, google, "Redirected by Social Care App to add data in")
Rel(data_insight_team, qlik, "Manage data extraction and reporting pipelines")
Rel(qlik, social_care_cases, "Hourly data export")
Rel(google, qlik, "Data ingestion via Google API")
Rel(social_care_cases, google, "Authenticates with groups and view Google Docs")
Rel(social_care_workflows, google, "Authenticates with groups and view Google Docs")
Rel(external_referrers, google, "Submit referrals via public form")
BiRel(google, mash_referral, "Proxy referrals. Generate google docs")
Rel(mash_referral, social_care_cases, "Submit to")
BiRel(social_care_finance, social_care_cases, "TBD")
Rel(care_practitioners, social_care_workflows, "Start an assessment")
BiRel(social_care_cases, social_care_workflows, "Share resident data")
BiRel(social_care_finance, social_care_workflows, "TBD")

SHOW_DYNAMIC_LEGEND()
@enduml
```

Source: [Hackney Social Care Context Diagram](https://lbhackney-it.github.io/social-care-architecture/#social-care-case-management-context-diagram)

!!! info "System Context Diagram Details"

    **Scope**: A single software system.
    
    **Primary elements**: The software system in scope.
    
    **Supporting elements**: People (e.g. users, actors, roles, or personas) and software systems (external 
    dependencies) that are directly connected to the software system in scope. Typically these other software systems 
    sit outside the scope or boundary of your own software system, and you don't have responsibility or ownership of 
    them.
    
    **Intended audience**: Everybody, both technical and non-technical people, inside and outside of the software 
    development team.
    
    **Recommended for most teams**: Yes.
 
### Container Diagram

Zooming in by one level, the container diagram (nothing to do with docker containers) splits out each application within
the system by its constituent containers. Containers can be APIs, frontend applications, and databases, amongst other 
things.

The Container diagram shows the high-level shape of the software architecture and how responsibilities are distributed 
across it. It also shows the major technology choices and how the containers communicate with one another. It's a 
simple, high-level technology focussed diagram that is useful for software developers and support/operations staff 
alike.

```diagram-plantuml
@startuml
!include <C4/C4_Container>

'ref http://plantuml.com/stdlib
!include <office/Users/user.puml>
!include <office/Users/mobile_user.puml>

title Social Care System Container Diagram

Person(care_practitioners, Social Care Practitioner, "<$user> <$user>\n Adult and Children" )
Person(data_insight_team, Data and Insight Team )

System_Ext(qlik, "Qlik Analytics", "ETL & Case progress reporting")

System_Boundary(googles, "Google") {
  System_Ext(google_auth, "Google Groups", "Provides User Authentication and Authorisation")
  System_Ext(google_forms, "Google Forms", "Data submissions (57 forms)")
  System_Ext(google_sheets, "Google Sheets", "Form submission data")
  System_Ext(google_docs, "Google Docs", "Generated for viewing (AppScript)")
}

System_Boundary(system, "Social Care") {
  System_Boundary(case-management, "Case Management") {
    Container(social_care_front_end, "Social Care Front End", "Lambda, Next.js (React)", "Allows practitioners to edit case information.")
    Container(social_care_service_api, "Social Care Case Viewer Service API", "Lambda, C#", "Provides backend API for the Social Care Front End")
  }

  System_Boundary(core-pathways, "Core Pathways") {
    Container(social_care_core_pathways, "Social Care Core Pathways Front End", "Lambda, Next.js (React)", "Allows practitioners to create new assessments against a resident/case.")
  }

  System_Boundary(finance, "Finance") {
    Container(adult_social_care_front_end, "Adult Social Care Care Package Builder Front End", "Lambda, React", "Allows adult social care workers to build and manage care packages.")
    Container(adult_social_care_api, "Adult Social Care Care Package Builder API", "Lambda, .NET (C#)", "Allows adult social care workers to build and manage care packages.")
    Container(adult_social_care_transactions_api, "Adult Social Care Package Builder Transactions API", "Lambda, .NET (C#)", "Manages transactions and payments relating to adult social care.")
  }
}

Rel(care_practitioners, social_care_front_end, "Manage cases using", "JSON/HTTPS")
Rel(care_practitioners, social_care_core_pathways, "Manage assessments for cases/residents", "JSON/HTTPS")
Rel(care_practitioners, google_forms, "Redirected by Social Care App to add data in", "JSON/HTTPS")
Rel(care_practitioners, google_docs, "Redirected by Social Care App to view form submissions", "HTTPS")
Rel(care_practitioners, qlik, "View / create dashboards and reports")
Rel(care_practitioners, adult_social_care_front_end, "Create care packages using", "JSON/HTTPS")

Rel(adult_social_care_front_end, adult_social_care_api, "Manage care packages using", "JSON/HTTPS")
Rel(adult_social_care_api, adult_social_care_transactions_api, "Manage transactions / payments using", "JSON/HTTPS")

Rel(social_care_core_pathways, social_care_service_api, "Get case / resident details", "JSON/HTTPS")

Rel_D(data_insight_team, qlik, "Manage data extraction and reporting pipelines")

Rel(social_care_front_end, social_care_service_api, "Read / Write", "JSON/HTTPS")
Rel(social_care_front_end, google_auth, "Authenticates practitioners via", "JSON/HTTPS")

Rel(qlik, social_care_service_api, "Hourly CSV export of form data to S3", "Qlik / AWS integration")

Rel(google_forms, google_sheets, "Submitted data stored in")
Rel(google_sheets, qlik, "Data ingestion", "Google API")
Rel(google_sheets, google_docs, "Generated from form data")
Rel_U(google_docs, google_auth, "Access restricted with")

SHOW_DYNAMIC_LEGEND()
@enduml
```

Source: [Hackney Social Care Container Diagram](https://lbhackney-it.github.io/social-care-architecture/#container-diagram)

!!! info "Container Diagram Details"

    **Scope**: A single software system.
    
    **Primary elements**: Containers within the software system in scope.
    
    **Supporting elements**: People and software systems directly connected to the containers.
    
    **Intended audience**: Technical people inside and outside of the software development team; including software 
    architects, developers and operations/support staff.
    
    **Recommended for most teams**: Yes.

    **Notes**: Notes: This diagram says nothing about clustering, load balancers, replication, failover, etc because it 
    will likely vary across different environments (e.g. production, staging, development, etc). This information is 
    better captured via one or more deployment diagrams.


### Component Diagram

The Component diagram shows how a container is made up of a number of "components", what each of those components are, 
their responsibilities and the technology/implementation details.

```diagram-plantuml
@startuml
!include <C4/C4_Component>

title Component diagram for Internet Banking System - API Application

Container(spa, "Single Page Application", "javascript and angular", "Provides all the internet banking functionality to customers via their web browser.")
Container(ma, "Mobile App", "Xamarin", "Provides a limited subset ot the internet banking functionality to customers via their mobile mobile device.")
ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
System_Ext(mbs, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

Container_Boundary(api, "API Application") {
    Component(sign, "Sign In Controller", "MVC Rest Controller", "Allows users to sign in to the internet banking system")
    Component(accounts, "Accounts Summary Controller", "MVC Rest Controller", "Provides customers with a summary of their bank accounts")
    Component(security, "Security Component", "Spring Bean", "Provides functionality related to singing in, changing passwords, etc.")
    Component(mbsfacade, "Mainframe Banking System Facade", "Spring Bean", "A facade onto the mainframe banking system.")

    Rel(sign, security, "Uses")
    Rel(accounts, mbsfacade, "Uses")
    Rel(security, db, "Read & write to", "JDBC")
    Rel(mbsfacade, mbs, "Uses", "XML/HTTPS")
}

Rel(spa, sign, "Uses", "JSON/HTTPS")
Rel(spa, accounts, "Uses", "JSON/HTTPS")

Rel(ma, sign, "Uses", "JSON/HTTPS")
Rel(ma, accounts, "Uses", "JSON/HTTPS")

SHOW_DYNAMIC_LEGEND()
@enduml
```

Source: [C4 Model Sample Component Diagram](https://github.com/plantuml-stdlib/C4-PlantUML/blob/master/samples/C4CoreDiagrams.md#component-diagram)

!!! info "Component Diagram Details"

    **Scope**: A single container.
    
    **Primary elements**: Components within the container in scope.
    
    **Supporting elements**: Containers (within the software system in scope) plus people and software systems directly 
    connected to the components.
    
    **Intended audience**: Software architects and developers.
    
    **Recommended for most teams**: No, only create component diagrams if you feel they add value, and consider 
    automating their creation for long-lived documentation.

## Additional Diagrams

### System Landscape Diagram

The system landscape can be useful in contextualising an entire ecosystem. From a practical perspective, a system 
landscape diagram is really just a system context diagram without a specific focus on a particular software system.

```diagram-plantuml
@startuml
'ref http://plantuml.com/stdlib
!include <C4/C4_Context>

title Social Care System Landscape Diagram

Person(care_practitioners, Social Care Practitioners, "Adult and Children")
Person_Ext(external_referrers, External Referrers, "Doctors, Police, Teachers ...")
Person(data_insight_team, Data and Insight Team)

Person(brokerage_team, Brokerage team)
Person(care_charge_team, Care charge team) 
Person(pay_runs_team, Pay runs team)
Person(cedar_team, Cedar team)

System_Boundary(system, "Social Care") {
  System(social_care_cases, "Social Care Case Management", "Manage case information.", $link="https://lbhackney-it.github.io/social-care-architecture/#social-care-case-management-context-diagram")
  System(social_care_core_pathways, "Social Care Core Pathways", "Manage assessment information.")
  System(social_care_finance, "Social Care Finance", "Care package management, procurement and accounting.")
  System_Ext(qlik, "Qlik Analytics", "ETL & Case progress reporting")
  System_Ext(google, "Google Services", "User Groups\nForms (Sheets)\nDocs")
  System_Ext(cedar, "Cedar", "Central Finance Platform")
  System(document_management, "Document Management System")
}

Rel(care_practitioners, social_care_cases, "Manage cases")
Rel(care_practitioners, social_care_core_pathways, "Manage assessments")
Rel(care_practitioners, qlik, "View / create dashboards and reports")
Rel(care_practitioners, google, "Redirected from case system to add / view data in google forms & docs")
Rel(data_insight_team, qlik, "Manage data extraction and reporting pipelines")
Rel(qlik, social_care_cases, "Hourly data export")
BiRel(document_management, social_care_finance, "Document uploads/downloads")
Rel(cedar_team, cedar, "Cedar finance package")
Rel(pay_runs_team, social_care_finance, "Manage invoices and purchase orders")
Rel(pay_runs_team, cedar_team, "Cedar finance package")
Rel(pay_runs_team, cedar, "Cedar finance package")
Rel(pay_runs_team, brokerage_team, "Brokerage packages")
Rel(google, qlik, "Data ingestion via Google API")
Rel(social_care_cases, google, "Authenticate users")
Rel(social_care_core_pathways, google, "Authenticate users")
Rel(social_care_core_pathways, social_care_cases, "Get resident data")
Rel_L(external_referrers, google, "Submit referrals via public form")
Rel(cedar,social_care_finance, "Supplier information")
BiRel(google, social_care_cases, "Proxy referrals. Generate google docs")
Rel(social_care_finance, pay_runs_team, "Cedar fianance package")
Rel(social_care_cases, social_care_finance, "Service user information")
Rel(brokerage_team, social_care_finance, "Handover" )
Rel(care_charge_team, social_care_finance, "Logging care charge values")
Rel(care_practitioners, brokerage_team, "Creates a care plan")
BiRel(care_practitioners, care_charge_team, "Financial assessment")

SHOW_DYNAMIC_LEGEND()
@enduml
```

Source: [Hackney Social Care System Landscape Diagram](https://lbhackney-it.github.io/social-care-architecture/#system-landscape-diagram)

!!! info "System Landscape Diagram Details"

    **Scope**: An enterprise/organisation/department/etc.
    
    **Primary elements**: People and software systems related to the chosen scope.
    
    **Intended audience**: Technical and non-technical people, inside and outside of the software development team.
    
    **Recommended for most teams**: Yes.


### Deployment Diagram

A deployment diagram allows you to illustrate how instances of software systems and/or containers in the static model 
are deployed on to the infrastructure within a given deployment environment.

These diagrams are useful when discussing concerns around infrastructure and security with external teams.

```diagram-plantuml
@startuml
!include <C4/C4_Deployment>

title Social Care System Deployment Diagram

Deployment_Node(aws, "AWS", "Region: eu-west-2") {

  Deployment_Node(aws_mosaic_production, "Mosaic-Production", "Account") {

    Deployment_Node(mosaic_production_case_management, "Case Management") {

      Deployment_Node(aws_production_apis_api_gateway, "API Gateway") {
        Container(frontend_api_gateway, "Social Care Frontend", "API Gateway", "Provides routing.")
      }

      Deployment_Node(aws_production_apis_lambda, "Lambda") {
        Container(frontend_api_lambda, "Social Care Frontend", "Lambda, Next.js (React)", "Provides the UI/UX of the Social Care System.")
      }

      Deployment_Node(aws_mosaic_production_api_gateway, "API Gateway") {
        Container(service_api_api_gateway, "Social Care Case Viewer API", "API Gateway", "Provides routing and auth via API keys.")
      }

      Deployment_Node(aws_mosaic_production_lambda, "Lambda") {
        Container(service_api_lambda, "Social Care Case Viewer API", "Lambda, C#", "Provides service API capabilities to the Social Care System.")
        Container(service_api_pg_import_lambda, "Social Care Case Viewer API - PostgresQL Import", "Lambda, C#", "Imports allocations.")
        Container(service_api_mongodb_import_lambda, "Social Care Case Viewer API - MongoDB Import", "Lambda, C#", "Imports form data.")
      }

      Deployment_Node(aws_mosaic_production_rds, "RDS") {
        ContainerDb(service_api_rds, "Social Care Case Viewer API", "PostgreSQL", "Stores persons, workers and allocations.")
        ContainerDb(platform_api_rds, "Resident Social Care Platform API", "PostgreSQL", "Stores historic case notes and visits.")
      }

      Deployment_Node(aws_mosaic_production_docdb, "DocumentDB") {
        ContainerDb(service_api_docdb, "Social Care Case Viewer API", "MongoDB", "Stores form data.")
      }

      Deployment_Node(aws_mosaic_production_s3, "S3") {
        Container(service_api_s3, "Social Care Case Viewer API - Qlik Import", "CSV", "Stores allocations and form data.")
      }

    }

    Deployment_Node(mosaic_production_finance, "Finance") {

      Deployment_Node(aws_mosaic_production_api_gateway_finance, "API Gateway") {
        Container(adult_social_care_builder_frontend_api_gateway, "Adult Social Care Care Package Builder Frontend", "API Gateway", "Provides routing.")
        Container(adult_social_care_builder_api_api_gateway, "Adult Social Care Care Package Builder API", "API Gateway", "Provides routing.")
        Container(adult_social_care_builder_transactions_api_api_gateway, "Adult Social Care Care Package Builder Transactions API", "API Gateway", "Provides routing.")
      }

      Deployment_Node(aws_mosaic_production_lambda_finance, "Lambda") {
        Container(adult_social_care_builder_frontend_lambda, "Adult Social Care Care Package Builder Frontend", "Lambda, Next.js (React)", "Provides the UI/UX of the Adult Social Care Care Package Builder System.")
        Container(adult_social_care_builder_api_lambda, "Adult Social Care Care Package Builder API", "Lambda, C#", "Provides service API capabilities to the Adult Social Care Care Package Builder System.")
        Container(adult_social_care_builder_transactions_api_lambda, "Adult Social Care Care Package Builder Transactions API", "Lambda, C#", "Handles transaction and finance related services to the Adult Social Care Care Package Builder System.")
      }

      Deployment_Node(aws_mosaic_production_rds_finance, "RDS") {
        ContainerDb(adult_social_care_builder_api_rds, "Adult Social Care Care Package Builder API", "PostgreSQL", "Stores care package related records.")
        ContainerDb(adult_social_care_builder_transactions_api_rds, "Adult Social Care Care Package Builder Transactions API", "PostgreSQL", "Stores transaction records related to care packages.")
      }
    }

    Deployment_Node(mosaic_production_social_care_referrals, "Social Care Referrals (MASH) Data Processing") {
      Deployment_Node(aws_mosaic_production_S3_proxy_api_gateway, "S3 API Gateway Proxy") {
        Container(social_care_s3_api_gateway, "Social Care Referrals S3 API", "API Gateway", "Provides API proxy that accepts HTTP requests to add objects to S3")
        Container(social_care_referrals_aws_s3, "Social Care Referrals S3 Bucket", "Mash form data, JSON", "Stores form data submitted via the MASH referral form")
      }

      Deployment_Node(aws_mosaic_production_referrals_lambda, "Lambda") {
        Container(social_care_referrals_lambda, "Social Care Referral Form Data Ingestion", "Typescript", "Gets referral data from S3, creates Google Doc and sends the data to be stored in the Social Care Case Management System")
      }

      Deployment_Node(aws_mosaic_production_referrals_sqs, "SQS") {
        Container(social_care_referrals_aws_sqs, "Social Care Referrals Queue", "Main queue, Deadletter queue", "Receives an event notification from S3 when an object is created in the bucket")
      }
    }
  }

  Deployment_Node(aws_workflows_production, "Social-Care-Workflows-Production", "Account") {
      Deployment_Node(aws_workflows_production_api_gateway, "API Gateway") {
        Container(social_care_workflows_frontend_api_gateway, "Social Care Core Pathways Frontend", "API Gateway", "Provides routing.")
      }

      Deployment_Node(aws_workflows_production_lambda, "Lambda") {
        Container(social_care_workflows_frontend_api_lambda, "Social Care Core Pathways Frontend", "Lambda, Next.js (React)", "Provides the UI/UX of the Social Care System.")
      }

      Deployment_Node(aws_workflows_production_rds, "RDS") {
        ContainerDb(workflows_rds, "Social Care Core Pathways", "PostgreSQL (13)", "Stores workflows, teams, and users.")
      }

      Deployment_Node(aws_workflows_production_s3, "S3") {
        Container(workflows_api_s3, "Social Care Core Pathways Configuration", "JSON", "Stores configuration data.")
      }

      Rel(social_care_workflows_frontend_api_gateway, social_care_workflows_frontend_api_lambda, "Uses", "HTTPS")
      Rel(social_care_workflows_frontend_api_lambda, workflows_rds, "Reads from and writes to", "Prisma ORM")
      Rel(social_care_workflows_frontend_api_lambda, workflows_api_s3, "Reads from", "S3 Client")
      Rel(social_care_workflows_frontend_api_lambda, service_api_api_gateway, "Reads resident details", "HTTPS/JSON")
  }
}

Deployment_Node(contentful, "Contentful CMS", "Hackney") {
  Container(social_care_workflows_contentful, "Social Care Core Pathways Configuration", "Contains configuration for core pathways forms, next steps and answer filters.")
}

Rel(social_care_workflows_contentful, workflows_api_s3, "Writes to", "S3 Client")

Deployment_Node(google, "Google Cloud Platform", "Hackney") {
  Container(social_care_referral_mash_apps_script, "Social Care Referrals Apps Script", "Google Apps Script", "Receives MASH form data and sends it to AWS for further processing")
}

Rel(frontend_api_gateway, frontend_api_lambda, "Uses", "HTTPS")
Rel(frontend_api_lambda, service_api_api_gateway, "Uses", "JSON/HTTPS")

Rel(service_api_api_gateway, service_api_lambda, "Uses", "HTTPS")
Rel(service_api_lambda, service_api_rds, "Reads from and writes to", "Entity Framework")
Rel(service_api_lambda, service_api_docdb, "Reads from and writes to", "Entity Framework")
Rel(service_api_lambda, platform_api_rds, "Reads from and writes to", "Entity Framework")

' Adult Social Care Care Package Builder
Rel(adult_social_care_builder_frontend_lambda, adult_social_care_builder_api_api_gateway, "Uses", "HTTPS/JSON")
Rel(adult_social_care_builder_api_api_gateway, adult_social_care_builder_api_lambda, "Uses", "HTTPS")
Rel(adult_social_care_builder_api_lambda, adult_social_care_builder_api_rds, "Reads from and writes to", "Entity Framework")
Rel(adult_social_care_builder_frontend_api_gateway, adult_social_care_builder_frontend_lambda, "Uses", "HTTPS")

' Adult Social Care Care Package Transactions
Rel(adult_social_care_builder_transactions_api_api_gateway, adult_social_care_builder_transactions_api_lambda, "Uses", "HTTPS")
Rel(adult_social_care_builder_transactions_api_lambda, adult_social_care_builder_transactions_api_rds, "Reads from and writes to", "Entity Framework")

' Adult Social Care Care Package Builder -> Adult Social Care Care Package Transactions
Rel(adult_social_care_builder_api_lambda, adult_social_care_builder_transactions_api_api_gateway, "Uses", "JSON/HTTPS")

Rel(service_api_s3, service_api_mongodb_import_lambda, "Triggers", "S3 Event Notification")
Rel(service_api_mongodb_import_lambda, service_api_docdb, "Imports into")

Rel(service_api_s3, service_api_pg_import_lambda, "Triggers", "S3 Event Notification")
Rel(service_api_pg_import_lambda, service_api_rds, "Imports into")

' Social Care Referrals Form Data Ingestion
Rel(social_care_referral_mash_apps_script, social_care_s3_api_gateway, "Uses", "JSON/HTTPS")
Rel(social_care_s3_api_gateway, social_care_referrals_aws_s3, "Creates", "JSON")
Rel(social_care_referrals_aws_s3, social_care_referrals_aws_sqs, "Sends", "S3 Event Notification")
Rel(social_care_referrals_aws_sqs, social_care_referrals_lambda, "Triggers", "SQS Event Notification")
Rel(social_care_referrals_lambda, social_care_referrals_aws_s3, "Reads from", "S3 Object")
Rel(social_care_referrals_lambda, service_api_api_gateway, "Uses", "JSON/HTTPS")

SHOW_DYNAMIC_LEGEND()
@enduml
```

Source: [Hackney Social Care Deployment Diagram](https://lbhackney-it.github.io/social-care-architecture/#deployment-diagram)

!!! info "Deployment Diagram Details"

    **Scope**: One or more software systems within a single deployment environment (e.g. production, staging, 
    development, etc).
    
    **Primary elements**: Deployment nodes, software system instances, and container instances.
    
    **Intended audience**: Infrastructure nodes used in the deployment of the software system.
    
    **Recommended for most teams**: Technical people inside and outside of the software development team; including 
    software architects, developers, infrastructure architects, and operations/support staff.
