Feature: Install and run the kit
  
  Scenario: Default configuration
    Given I have downloaded the prototype kit
    And I am on the correct version of nodejs
    And I have installed the dependencies
    When I run the kit
    Then I should be able to access it on http://localhost:3000/
  
  Scenario: Custom port
    Given I have downloaded the prototype kit
    And I am on the correct version of nodejs
    And I have installed the dependencies
    And I set the port to 3001
    When I run the kit
    Then I should be able to access it on http://localhost:3001/
