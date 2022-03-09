Feature: Install and run the kit
  
  Scenario: Default configuration
    Given I have downloaded the prototype kit
    And I am on the correct version of nodejs
    And I have installed the dependencies
    When I run the kit
    Then I should be able to access it on 
