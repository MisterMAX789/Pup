Feature: Booking a movie ticket for tomorrow
    Scenario:  User  select a seat and booking a ticket
        Given user is on "/index.php" page
        When user select 2-th day and movie
        And select and book 5 row and 1 seat
        Then user receive confirmation
    Scenario: The user wants to check if the seat is booked
        Given user is on "/index.php" page
        When user select 2-th day and movie
        And select and book 5 row and 4 seat
        And user is on "/index.php" page
        When user select 2-th day and movie
        And see 5 row and 2 seat try select them
        Then Book button is not active
    Scenario: user wants to booking three tickets for Movie-1
        Given user is on "/index.php" page
        When user select 2-th day and movie
        And select and book 5 row and 6,7,8 seats
        Then user receive confirmation