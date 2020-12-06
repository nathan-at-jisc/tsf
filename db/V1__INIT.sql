CREATE TABLE devices (
    id serial,
    scanning_device_id INT,
    visible_device_id INT,
    time TIMESTAMP,
    interface VARCHAR,
    signal_strength real
);