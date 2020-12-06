## Notes

The API has been knocked up quickly, to reflect the amount of time spent on the test. I haven't used a linter, added detailed tests, or even a proper project structure. If I was asked to do this project at work in half a day, this is the quality of the work. As you can imagine, if this was for a client, and we had 8 weeks (along with more details for the projec), we'd spend more time making sure the code is clean and more maintainable.

For a project like this, I would be unlikely to write unit tests, and just create end-to-end tests, where we run the local environment (api, ui, db and devData), then interact with the API using `jest` and `axios`.

Also, the SQL used to grab the unique device ids is a query I've never used before and was googled, I've used the `OVER()` function before, but I'm still not 100% clear on what it does (under the hood), I just know when to use it. It may be that for something like this I'd use Mongo instead, but I know SQL more so stuck with that.


## Development environment

To run the development envrionment make sure you have `docker` and `docker-compose` installed. Then run:

- `docker-compose up`
- `cd api && npm run start`
- `cd ../ui && npm run start`

The `docker-compose` file will start a postgres database as well as a flyway migration which will setup the db.

## API

> GET /devices

```json
[
    1,
    2,
    3
]
```

> GET /devices/{id}?date_from={iso_timestamp}&date_to={iso_timestamp}

This will return all the rows where the device has scanned another device, or been scanned by another device.

```json
[
    {
        "id": 1,
        "scanning_device_id": 1,
        "visible_device_id": 2,
        "time": "2020-12-04T08:15:30.000Z",
        "interface": "WIFI",
        "signal_strength": 2,
        "avg": 3.25
    },
    {
        "id": 2,
        "scanning_device_id": 1,
        "visible_device_id": 3,
        "time": "2020-12-04T08:17:30.000Z",
        "interface": "WIFI",
        "signal_strength": 5,
        "avg": 3.25
    },
    {
        "id": 3,
        "scanning_device_id": 1,
        "visible_device_id": 2,
        "time": "2020-12-04T08:15:30.000Z",
        "interface": "WIFI",
        "signal_strength": 2,
        "avg": 3.25
    },
    {
        "id": 4,
        "scanning_device_id": 1,
        "visible_device_id": 3,
        "time": "2020-12-04T08:17:30.000Z",
        "interface": "WIFI",
        "signal_strength": 5,
        "avg": 3.25
    },
    {
        "id": 5,
        "scanning_device_id": 1,
        "visible_device_id": 2,
        "time": "2020-12-04T08:15:30.000Z",
        "interface": "WIFI",
        "signal_strength": 2,
        "avg": 3.25
    },
    {
        "id": 6,
        "scanning_device_id": 1,
        "visible_device_id": 3,
        "time": "2020-12-04T08:17:30.000Z",
        "interface": "WIFI",
        "signal_strength": 5,
        "avg": 3.25
    },
    {
        "id": 7,
        "scanning_device_id": 2,
        "visible_device_id": 1,
        "time": "2020-12-04T09:15:30.000Z",
        "interface": "WIFI",
        "signal_strength": 1,
        "avg": 3.25
    },
    {
        "id": 9,
        "scanning_device_id": 3,
        "visible_device_id": 1,
        "time": "2020-12-04T09:18:30.000Z",
        "interface": "WIFI",
        "signal_strength": 4,
        "avg": 3.25
    }
]
```

> POST /devices/scan

```json
{
    "scanning_device_id": "2",
    "visible_devices": [
        {
            "visible_device_id": "1",
            "time": "2020-12-04T09:15:30-05:00",
            "interface": "WIFI",
            "signal_strength": 1
        },
        {
            "visible_device_id": "3",
            "time": "2020-12-04T09:15:30-05:00",
            "interface": "WIFI",
            "signal_strength": 4
        }
    ]
}
```