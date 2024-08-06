# apis for backend calling of the main project 

This is the backend code of Prince's Website for booking, travelling and other functionalities


[POST] registration: http://localhost:8000/api/v1/users/register
[POST] login: http://localhost:8000/api/v1/users/login
[POST] logout: http://localhost:8000/api/v1/users/logout

[POST]  http://localhost:8000/api/v1/users/refresh-token        ------- for refreshing token
[PATCH]  http://localhost:8000/api/v1/users/update-avatar       ------ for user avatar(image) updation
[PATCH]  http://localhost:8000/api/v1/users/update-user         -- to update user details such as firstname,lastname, email
[PATCH]  http://localhost:8000/api/v1/users/change-password     --- for changing user's password
[GET]  http://localhost:8000/api/v1/users/current-user          ---- If user is logged in, this endpoint will give the user's details(except for password)
[DELETE] http://localhost:8000/api/v1/users/delete-user/:userId ----- for deleting the user account with id=:userId

[POST] http://localhost:8000/api/v1/users/send-otp              ----- for sending OTP to the given phone number
[POST] http://localhost:8000/api/v1/users/verify-otp            ----- for verifying the OTP sent to the phone number

[POST] http://localhost:8000/api/v1/users/send-email              ----- for sending JWT tokenised link to the email
[GET] http://localhost:8000/api/v1/users/verify-email/:token      ----- for verifying email


