INSERT INTO public.users (id, username, email, role, birth_date, gender, pfp_image_url) VALUES
(1, 'john_doe', 'john.doe@example.com', 'user', '11/01/2000', 'male', 'https://picsum.photos/id/10/200/200'),
(2, 'jane_smith', 'jane.smith@example.com', 'user', '06/09/2004', 'female', 'https://picsum.photos/id/9/200/200'),
(3, 'alice_jones', 'alice.jones@example.com', 'user', '05/11/1998', 'female', 'https://picsum.photos/id/8/200/200'),
(6, 'dow_jones', 'dow.jones@example.com', 'user', '05/26/1896', 'non-binary', 'https://picsum.photos/id/11/200/200');
INSERT INTO public.posts (id, user_id, image_url, type_of_activity, duration, location, post_message, title, date) VALUES
(1, 1, 'https://picsum.photos/id/7/200/200', 'Running', '30 minutes', 'Central Park', 'Had a great run today!', 'Morning Run', '2023-10-01'),
(2, 2, 'https://picsum.photos/id/6/200/200', 'Cycling', '1 hour', 'River Trail', 'Enjoyed a beautiful ride!', 'Evening Cycle', '2023-10-02'),
(3, 3, 'https://picsum.photos/id/5/200/200', 'Yoga', '1 hour', 'Home', 'Feeling relaxed after yoga.', 'Yoga Session', '11/01/2000');
INSERT INTO public.comments (comment_message, user_id, post_id, created_on) VALUES
('Great post!', 1, 1),
('Thanks for sharing!', 2, 1),
('I love yoga too!', 3, 3),
('Wow!', 6, 2);