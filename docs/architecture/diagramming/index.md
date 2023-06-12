---
title: Diagramming
---

# Why diagram?

As an industry, we do have the Unified Modeling Language (UML), ArchiMate and SysML, but asking whether these provide an 
effective way to communicate software architecture is often irrelevant because many teams have already thrown them out 
in favour of much simpler "boxes and lines" diagrams. Abandoning these modelling languages is one thing but, perhaps in 
the race for agility, many software development teams have lost the ability to communicate visually.

# Different Diagrams for Different Audiences

## System Context Diagram

```mermaid
C4Context
    Person(customer, "Customer", "A customer of <br />Widgets Limited.")
    
    Enterprise_Boundary(c0, "Widgets Limited") {
        Person(csa, "Customer Service Agent", "Deals with customer enquiries.")
        System(ecommerce, "E-commerce System", "Allows customers to buy widgets<br />online via the widgets.com website.")
        System(fulfillment, "Fulfillment System", "Responsible for processing and <br />shipping of customer orders.")
    }
    
    System_Ext(taxamo, "Taxamo", "Calculates local tax <br />(for EU B2B customers) and acts as <br />a front-end for Braintree Payments.")
    
    System_Ext(braintree, "Braintree Payments", "Processes credit card payments on <br />behalf of Widgets Limited.")
    
    System_Ext(post, "Jersey Post", "Calculates worldwide <br />shipping costs for packages.")
    
    Rel_R(customer, csa, "Asks questions to", "Telephone")
    
    Rel_R(customer, ecommerce, "Places orders for widgets using")
    
    Rel(csa, ecommerce, "Looks up order information using")
    
    Rel_R(ecommerce, fulfillment, "Sends order information to")
    
    Rel_D(fulfillment, post, "Gets shipping charges from")
    
    Rel_D(ecommerce, taxamo, "Delegates credit card processing to")
    
    Rel_L(taxamo, braintree, "Uses for credit card processing")
```

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
