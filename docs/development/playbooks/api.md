---
title: API Playbook
---

APIs are an essential part of modern software development, and when correctly managed, APIs can reduce time to 
production for digital transformation projects.

This API playbook will help readers understand:

* How we go about building our APIs
* How we support and maintain our APIs
* Best practices that we have adopted as standard in our development of APIs

## Naming Conventions

#### Paths

**MUST** use lowercase separate words with hyphens for url path segments.

```
/shipment-orders/{shipment-order-id}
```

This applies to concrete path segments and not the names of path parameters. For example `{shipment_order_id}` would be
ok as a path parameter.

**MUST** avoid trailing slashes

The trailing slash must not have specific semantics. Resource paths must deliver the same results whether they have the 
trailing slash or not.

```
/posts/ === /posts
```

#### Query Parameters

**MUST** use snake_case for Query Parameters.

```
customer_number, order_id, billing_address
```

**MUST** use conventional query parameters.

If you provide query support for searching, sorting, filtering, and paginating, you must stick to the following naming 
conventions:

* `q` - default query parameter (e.g. used by browser tab completion); should have an entity specific alias, like 
        `post-id` for a blog post.

* `sort` - comma-separated list of fields to define the sort order. To indicate sorting direction, fields may be 
           prefixed with + (ascending) or - (descending), e.g. `/sales-orders?sort=+id`

* `fields` - to retrieve only a subset of fields of a resource

* `embed` - to expand or embed sub-entities (i.e.: inside of an article entity, expand comments into the comments 
            object). Implementing embed correctly is difficult, so do it with care

* `offset` - numeric offset of the first element on a page. See pagination section

* `limit` - client suggested limit to restrict the number of entries on a page.

#### Resource Names

**MUST** pluralise resource names.

```
/posts
/posts/{post-id}
/posts/{post-id}/comments
/posts/{post-id}/comments/{comment-id}
```

Usually, a collection of resource instances is provided, in the special case of a resource singleton they are treated as 
a collection with cardinality 1. 

For example, a user only has a single record of system settings key value pairs, this can be presented as follows.

```
/user/{user-id}/settings
```
