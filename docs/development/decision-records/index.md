---
title: Decision Records
---

## Why record decisions?

Most projects will make decisions that are agreed upon by team members and drastically impact the path taken to fulfil
the project's requirements. Recording these decisions is an important part of project governance and eases onboarding
for new developers.

## How to record decisions

Decisions can be recorded in short-form or long-form, to provide the best results, long-form decision records should be
used where possible. A good choice for the first decision record of a project is recording that you will in fact, record
decisions.

### Short Decision Record Example

    # Use Plain JUnit5 for advanced test assertions

    Proposed :material-help-circle: | 14 June 2023 | Lawrence Goldstien
    
    ## Context and Problem Statement
    
    How to write readable test assertions?
    How to write readable test assertions for advanced tests?
    
    ## Considered Options
    
    * Plain JUnit5
    * Hamcrest
    * AssertJ
    
    ## Decision Outcome
    
    Chosen option: "Plain JUnit5", because it is a standard framework and the features of the other frameworks do not
    outweigh the drawback of adding a new dependency.


### Long Decision Record Example

    # Use Plain JUnit5 for advanced test assertions

    Proposed :material-help-circle: | 14 June 2023 | Lawrence Goldstien
    
    ## Context and Problem Statement
    
    How to write readable test assertions?
    How to write readable test assertions for advanced tests?
    
    ## Considered Options
    
    * Plain JUnit5
    * Hamcrest
    * AssertJ
    
    ## Decision Outcome
    
    Chosen option: "Plain JUnit5", because comes out best (see below).
    
    ### Consequences
    
    * Good, because tests are more readable
    * Good, because more easy to write tests
    * Good, because more readable assertions
    * Bad, because more complicated testing leads to more complicated assertions
    
    ## Pros and Cons of the Options
    
    ### Plain JUnit5
    
    Homepage: <https://junit.org/junit5/docs/current/user-guide/>
    JabRef testing guidelines: <https://devdocs.jabref.org/getting-into-the-code/code-howtos#test-cases>
    
    Example:
    
    ```java
    String actual = markdownFormatter.format(source);
    assertTrue(actual.contains("Markup<br />"));
    assertTrue(actual.contains("<li>list item one</li>"));
    assertTrue(actual.contains("<li>list item 2</li>"));
    assertTrue(actual.contains("> rest"));
    assertFalse(actual.contains("\n"));
    ```
    
    * Good, because Junit5 is "common Java knowledge"
    * Bad, because complex assertions tend to get hard to read
    * Bad, because no fluent API
    
    ### Hamcrest
    
    Homepage: <https://github.com/hamcrest/JavaHamcrest>
    
    * Good, because offers advanced matchers (such as `contains`)
    * Bad, because not full fluent API
    * Bad, because entry barrier is increased
    
    ### AssertJ
    
    Homepage: <https://joel-costigliola.github.io/assertj/>
    
    Example:
    
    ```java
    assertThat(markdownFormatter.format(source))
            .contains("Markup<br />")
            .contains("<li>list item one</li>")
            .contains("<li>list item 2</li>")
            .contains("> rest")
            .doesNotContain("\n");
    ```
    
    * Good, because offers fluent assertions
    * Good, because allows partial string testing to focus on important parts
    * Good, because assertions are more readable
    * Bad, because not commonly used
    * Bad, because newcomers have to learn an additional language to express test cases
    * Bad, because entry barrier is increased
    * Bad, because expressions of test cases vary from unit test to unit test
    
    ## More Information
    
    German comparison between Hamcrest and AssertJ: <https://www.sigs-datacom.de/uploads/tx_dmjournals/philipp_JS_06_15_gRfN.pdf>.
