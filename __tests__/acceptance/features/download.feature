@browser
Feature: Downloading the GOV.UK Prototype Kit

  Scenario: Downloading the latest version
    Given I am on the install page
    When I click the download link
    And the download is complete
    Then I should have the latest release archive in my downloads folder
