import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@material-ui/core';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import Papa from 'papaparse';

export const YamlFetchComponent = () => {
    const [inputUrl, setInputUrl] = useState('');
    const [storedUrl, setStoredUrl] = useState('');
    const [data, setData] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [headers, setHeaders] = useState([]);
    const [showUrl, setShowUrl] = useState(false);
    const storageApi = useApi(storageApiRef);

    const isValidGithubUrl = (url) => {
        const pattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/.+/;
        return pattern.test(url);
    };

    useEffect(() => {
        const fetchStoredUrlAndData = async () => {
            const url = await storageApi.get('csvUrl');
            setStoredUrl(url || '');
            if (url) {
                const fetchUrl = convertToRawGithubUrl(url);
                fetchCsvData(fetchUrl);
            }
        };
        fetchStoredUrlAndData();
    }, [storageApi]);

    const handleStoredUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStoredUrl(event.target.value);
    };

    const handleStoredUrlSubmit = async () => {
        const fetchUrl = convertToRawGithubUrl(storedUrl);
        await storageApi.set('csvUrl', storedUrl);
        fetchCsvData(fetchUrl);
    };

    const convertToRawGithubUrl = (url: string) => {
        if (!isValidGithubUrl(url)) {
            console.error('Invalid GitHub URL: ', url);
            return url;
        }
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
        if (!match) {
            console.error('Invalid GitHub URL structure: ', url);
            throw new Error('Invalid GitHub URL structure');
        }
        const [, repoOwner, repoName, , filePath] = match;
        return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;
    };

    const fetchCsvData = async (url: string) => {
        console.log('Fetching CSV data from: ', url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvData = await response.text();
            const result = Papa.parse(csvData, { header: true });
            setData(result.data);
            if (result.data.length > 0) {
                setSelectedRole(result.data[0].role || '');
                setHeaders(Object.keys(result.data[0]));
            }
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    };

    const handleFetchClick = async () => {
        const fetchUrl = convertToRawGithubUrl(inputUrl);
        await storageApi.set('csvUrl', inputUrl);
        fetchCsvData(fetchUrl);
    };

    const roles = [...new Set(data.map(item => item[headers[0]]))];

    return (
        <div>
            {storedUrl && !showUrl ? (
                <>
                    <Button variant="contained" color="primary" onClick={() => setShowUrl(true)}>
                        Show URL
                    </Button>
                </>
            ) : storedUrl && showUrl ? (
                <>
                    <TextField
                        label="Input URL"
                        variant="outlined"
                        value={inputUrl}
                        onChange={event => setInputUrl(event.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleFetchClick} style={{ marginTop: '10px' }}>
                        Save URL
                    </Button>

                </>
            ) : null}
            <Box mt={3}>
                <Typography variant="body1">
                    Stored URL: {storedUrl || 'No URL'}
                </Typography>
            </Box>
            <Box mt={3}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        value={selectedRole}
                        onChange={event => setSelectedRole(event.target.value)}
                        label="Filter"
                    >
                        {roles.map((role, index) => (
                            <MenuItem key={index} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
                                <TableCell key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter(item => !selectedRole || item[headers[0]] === selectedRole).map((item, index) => (
                            <TableRow key={index}>
                                {headers.map((header, index) => (
                                    <TableCell key={index}>{item[header]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};