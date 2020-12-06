import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Select,
    Grid,
    MenuItem,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Typography
} from '@material-ui/core';
import { DateTimePicker } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

momentLocalizer(moment);

const App = () => {

    const [devices, setDevices] = useState([]);
    const [deviceInformation, setDeviceInformation] = useState([]);
    const [searchData, setSearchData] = useState({
        deviceId: null,
        dateFrom: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1, 
            new Date().getDate()
        ),
        dateTo: new Date()
    });

    useEffect(() => {
        axios.get('http://localhost:4003/devices').then(deviceList => {
            setDevices(deviceList.data);
            setSearchData({
                ...searchData,
                deviceId: deviceList.data[0]
            });
        }).catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        const { deviceId, dateFrom, dateTo } = searchData;
        console.log(searchData);
        if(deviceId && dateFrom && dateTo){
            axios.get(`http://localhost:4003/devices/${deviceId}?date_from=${dateFrom.toISOString()}&date_to=${dateTo.toISOString()}`).then(res => {
                setDeviceInformation(res.data);
                console.log(res.data);
            })
        }
    }, [searchData])

    if(devices){
        return(
            <>
                <Grid container>
                    <Select
                        onChange={(e) => setSearchData({
                            ...searchData,
                            deviceId: e.target.value
                        })}
                        value={searchData.deviceId}
                    >
                        {devices.map(device => <MenuItem value={device}>{device}</MenuItem>)}
                    </Select>
                    <DateTimePicker
                        label='Time from'
                        onChange={(e) => setSearchData({
                            ...searchData,
                            dateFrom: e
                        })}
                        defaultValue={searchData.dateFrom}
                    />
                    <DateTimePicker
                        label='Time from'
                        onChange={(e) => setSearchData({
                            ...searchData,
                            dateTo: e
                        })}
                        defaultValue={searchData.dateTo}
                    />
                </Grid>
                {
                    deviceInformation.length > 0 && (
                    <>
                        <Grid container>
                            <Typography>Average Signal Strength: {deviceInformation[0].avg}</Typography>
                        </Grid>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Scanning Device</TableCell>
                                        <TableCell>Visible Device</TableCell>
                                        <TableCell>Signal Type</TableCell>
                                        <TableCell>Signal Strength</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deviceInformation.map(device => (
                                        <TableRow>
                                            <TableCell>{device.scanning_device_id}</TableCell>
                                            <TableCell>{device.visible_device_id}</TableCell>
                                            <TableCell>{device.interface}</TableCell>
                                            <TableCell>{device.signal_strength}</TableCell>
                                            <TableCell>{device.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                    )
                }

            </>
        );
    }else{
        return null;
    }

};

export default App;