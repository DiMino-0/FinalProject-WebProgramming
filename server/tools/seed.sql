INSERT INTO public.users (id, username, email, role, birth_date, gender, pfp_image_url) VALUES
(1, 'john_doe', 'john.doe@example.com', 'user', '11/01/2000', 'male', 'https://picsum.photos/id/18/200/300)'),
(2, 'jane_smith', 'jane.smith@example.com', 'user', '1992-02-02', 'female', 'https://example.com/jane_smith.jpg'),
(3, 'alice_jones', 'alice.jones@example.com', 'user', '11/01/2000', 'female', 'https://example.com/alice_jones.jpg');
INSERT INTO public.posts (id, user_id, image_url, type_of_activity, duration, location, post_message, title, date) VALUES
(1, 1, 'https://example.com/image1.jpg', 'Running', '30 minutes', 'Central Park', 'Had a great run today!', 'Morning Run', '2023-10-01'),
(2, 2, 'https://example.com/image2.jpg', 'Cycling', '1 hour', 'River Trail', 'Enjoyed a beautiful ride!', 'Evening Cycle', '2023-10-02'),
(3, 3, NULL, 'Yoga', '1 hour', 'Home', 'Feeling relaxed after yoga.', 'Yoga Session', '11/01/2000');
INSERT INTO public.comments (comment_message, user_id, post_id) VALUES
('Great post!', 1, 1),
('Thanks for sharing!', 2, 1),
('I love yoga too!', 3, 3);