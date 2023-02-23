import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { format, parseISO, addHours, addMinutes } from 'date-fns';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Table from 'react-bootstrap/Table';
import { FaRegBell, FaRegBellSlash } from 'react-icons/fa';
import SearchTable from './SearchTable';

function Contact() {
    const [entry, setEntry] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        date: format(addHours(new Date(), 1), 'yyyy-MM-dd HH:mm'),
        topic: "",
        notify: false,
        notifyTime: 0
    });

    const [contact, setContact] = useState('email');

    const [validated, setValidated] = useState(false);

    const [entries, setEntries] = useState([]);

    const [data, setData] = useState([]);

    useEffect(() => {
        getEntries();
    }, [])

    useEffect(() => {
        setData(
            entries.map(e => ({
                name: e.Data.name,
                contact: coalesce(e.Data.email, e.Data.phone, e.Data.username),
                topic: e.Data.topic,
                date: e.Data.date,
                notify: e.Data.notify ? <FaRegBell /> : <FaRegBellSlash />
            }))
        );
    }, [entries])

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',

            },
            {
                Header: 'Contact',
                accessor: 'contact'
            },
            {
                Header: 'Topic',
                accessor: 'topic'
            },
            {
                Header: 'Date and time',
                accessor: 'date'
            },
            {
                Header: 'Notify',
                accessor: 'notify',
                Cell: (props: { value: object }) => {
                    return <div style={{ "textAlign": "center" }}>{props.value}</div>
                }
            },
        ], []
    );

    const template = {
        name: "",
        email: "",
        phone: "",
        username: "",
        date: format(addHours(new Date(), 1), 'yyyy-MM-dd HH:mm'),
        topic: "",
        notify: false,
        notifyTime: 0
    }

    const getEntries = async () => {
        const url = "api/entry/GetEntryList";
        try {
            const result = await axios.get(url)
                .then((result) => {
                    let newEntries = result.data.map(d => ({ Id: d.Id, Data: JSON.parse(d.Data) }));
                    setEntries(newEntries);
                })
        } catch (error) {
            console.error(error);
        }
    }

    const postEntry = () => {
        const url = "api/entry";
        let data = {
            name: entry.name.trim(),
            date: format(parseISO(entry.date), 'yyyy-MM-dd HH:mm'),
            topic: entry.topic,
            notify: entry.notify
        };

        if (entry.notify)
            data = { ...data, notifyTime: entry.notifyTime };

        switch (contact) {
            case 'email':
                data = { ...data, email: entry.email };
                break;
            case 'phone':
                data = { ...data, phone: entry.phone };
                break;
            case 'telegram':
                data = { ...data, username: entry.username };
                break;
            default:
                break;
        }

        axios.post(url, data)
            .then(() => {
                setValidated(false);
            })
            .finally(() => {
                getEntries();
                setEntry(template);
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false || !isValidPhoneNumber(entry.phone)) {
            event.stopPropagation();
        } else {
            postEntry();
        }
        setValidated(true);
    };

    const coalesce = (...args) => args.find(a => ![null, undefined].includes(a));

    return (
        <Container>
            <h1 className="my-sm-5 my-3">Get in touch</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="mb-5">
                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label className="text-light">Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            minLength="1"
                            pattern="^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']?$"
                            placeholder="Robert Wilson"
                            value={entry.name}
                            onChange={(e) => setEntry({ ...entry, name: e.target.value })}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please, write your name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" className="mt-3 mt-md-0">
                        <Form.Label className="text-light">Contact via</Form.Label>
                        <Form.Select value={contact} onChange={(e) => setContact(e.target.value)}>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="telegram">Telegram</option>
                        </Form.Select>
                    </Form.Group>

                    {contact === 'email' &&
                        <Form.Group as={Col} md="4" className="mt-3 mt-md-0">
                            <Form.Label className="text-light">Email</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="email"
                                    placeholder="robertwilson@ghost.com"
                                    value={entry.email}
                                    onChange={(e) => setEntry({ ...entry, email: e.target.value })}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Where should I write you?
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>}

                    {contact === 'phone' &&
                        <Form.Group as={Col} md="4" className="mt-3 mt-md-0">
                            <Form.Label className="text-light">Phone</Form.Label>

                            <InputGroup hasValidation>
                                <PhoneInput
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={entry ? entry.phone : "+81234567890"}
                                    onChange={(e) => setEntry({ ...entry, phone: e })}
                                    required />
                                <Form.Control.Feedback type="invalid" className={validated ? "d-block" : "d-none"}>
                                    {entry.phone ?
                                        (isValidPhoneNumber(entry.phone) ? undefined : "Incorrect phone number") :
                                        "Please, enter your phone number"}
                                </Form.Control.Feedback>
                            </InputGroup>

                        </Form.Group>}

                    {contact === 'telegram' &&
                        <Form.Group as={Col} md="4" className="mt-3 mt-md-0">
                            <Form.Label className="text-light">Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text>@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    minLength="5"
                                    pattern="^[a-z]{1}[a-z0-9_]*$"
                                    value={entry.username}
                                    onChange={(e) => setEntry({ ...entry, username: e.target.value })}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    What's your username?
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>}
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label className="text-light">Date and time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            min={format(addMinutes(new Date(), 15), 'yyyy-MM-dd HH:mm')}
                            value={entry.date}
                            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                            required />
                        <Form.Control.Feedback type="invalid">
                            Our appointment should be at least in an hour.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="8" className="mt-3 mt-md-0">
                        <Form.Label className="text-light">Topic</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            minLength="3"
                            maxLength="128"
                            placeholder="I've got some jobs ready for you"
                            pattern="^[a-zA-Zа-яёА-ЯЁ0-9]{1}[a-zA-Zа-яёА-ЯЁ0-9 ,'!?]*$"
                            value={entry.topic}
                            onChange={(e) => setEntry({ ...entry, topic: e.target.value })} />
                        <Form.Control.Feedback type="invalid">
                            A couple of words, please.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3 mt-4">
                    <Form.Group as={Col} md="4" sm="6"
                        className="d-flex justify-content-between align-items-center"
                        style={{ height: "36px" }}>
                        <Form.Check noValidate
                            type="switch"
                            label="Notify in..."
                            checked={entry.notify}
                            onChange={(e) => setEntry({ ...entry, notify: e.target.checked })} />

                        <ToggleButtonGroup
                            type="radio"
                            name="notifyTime"
                            defaultValue={30}
                            value={entry.notifyTime}
                            onChange={(e) => setEntry({ ...entry, notifyTime: e })}
                            className={!entry.notify ? "d-none" : ""}>

                            <ToggleButton id="tbg-radio-1" value={30} className="btn-light">
                                30 min
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-2" value={60} className="btn-light">
                                1 hr
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-3" value={120} className="btn-light">
                                2 hrs
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </Form.Group>
                </Row>

                <Button type="submit" variant="primary" size="lg">Submit</Button>
            </Form>

            <h1 className="mt-sm-5 mt-3">Entries</h1>
            
            {
                entries.length ?
                    (
                        <SearchTable columns={columns} data={data} />
                    )
                    :
                    null
            }
            
        </Container>
    )
}

export default Contact;