import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Modal, Col, Container, Row, Form, Button, FormGroup, FormLabel } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { BsCheckCircleFill } from 'react-icons/bs'
import { MdOutlineError } from 'react-icons/md'
export default function BirthCertificate() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [StatusMsg, setStatusMsg] = useState(false)
    const [loginData, setLoginData] = React.useState({});


    //Popup message for Success and Error
    function SuccessModal() {
        return <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className='form__popup'>
                    <div className='success__icon'>
                        {StatusMsg ?
                            <BsCheckCircleFill />
                            :
                            <MdOutlineError />
                        }
                    </div>
                    <h4>{StatusMsg ? "Form Submitted Successfully" : "Something went wrong"}</h4>
                </Modal.Body>
            </Modal>
        </>
    }

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async data => {
        const emptySpace = /\S/g //regex for empty string
        const filteredData = {
            ...data,
            name: emptySpace.test(data.name) ? data.name : 'NA',
            weight: data.weight === '' ? 'NA' : data.weight
        }
        // BirthFormAPI(filteredData)
        console.log("filteredData", filteredData);
        console.log("loginData", loginData);


        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginData.token}`
        }

        let bodyContent = JSON.stringify({
            "dob": filteredData.dob,
            "name": filteredData.name,
            "gender": filteredData.gender,
            "father_name": filteredData.father_name,
            "mother_name": filteredData.mother_name,
            "address_birth": filteredData.address_birth,
            "address": filteredData.address,
            "placeofbirth": filteredData.placeofbirth,
            "hospital_name": filteredData.hospital_name,
            "weight": filteredData.weight
        });

        let reqOptions = {
            url: "http://localhost:4000/channels/mychannel/chaincodes/birthcert",
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        console.log("Transaction ID:", response.data.result.tx_id);

    };

    React.useEffect(() => {
        fetch("http://localhost:4000/users", {
            method: "POST",
            body: JSON.stringify({
                "username": "user",
                "orgName": "Org1"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then((resData) => {
                setLoginData(resData)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    // function BirthFormAPI(data) {

    //     console.log("loginData token", loginData.token);
    //     axios.post(`http://localhost:4000/channels/mychannel/chaincodes/birthcert`, {
    //         body: JSON.stringify({

    //             "dob": "2023-03-16",
    //             "name": "nitant",
    //             "gender": "Male",
    //             "father_name": "ssssss",
    //             "mother_name": "ssssss",
    //             "address_birth": "ffff",
    //             "address": "asddd",
    //             "placeofbirth": "indore",
    //             "hospital_name": "aaaaaa",
    //             "weight": "6"

    //         }),
    //         headers: {
    //             'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk0MzExMTUsInVzZXJuYW1lIjoidXNlciIsIm9yZ05hbWUiOiJPcmcxIiwiaWF0IjoxNjc5Mzk1MTE1fQ.q17-4tmnIpkMAt_E_0g4kq7XpgQTpUBJXVJ9dBXKqGI`,
    //             "Accept": "*/*",
    //             "Content-Type": "application/json",
    //         }
    //     }).then((e) => {
    //         console.log(e.data.data);
    //         setStatusMsg(true)
    //         setShow(true)
    //     }).catch((error) => {
    //         console.log(error);
    //         setStatusMsg(false)
    //         setShow(true)
    //     })
    // }

    return (
        <>
            <section className='birth_form_section'>
                <Container>
                    <Row className='justify-content-center'>
                        <Col lg={8}>
                            <div className='form_container'>
                                <div className='form_head'>
                                    <h1>Birth Certificate Form</h1>
                                </div>
                                <div className='form_area' >
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col>
                                                <FormGroup className="mb-3" controlId="dob">
                                                    <FormLabel> <strong> Date of Birth*</strong> </FormLabel>
                                                    <Form.Control type="date" placeholder="Enter email"
                                                        {...register("dob", { required: true })}
                                                    />
                                                    {errors.dob && <small className='field_error'>Date of Birth is required</small>}
                                                    <Form.Text className="text-muted">
                                                        (Enter the exact month, day, and year the child was born e.g. 1-1-2000)
                                                    </Form.Text>
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="nameOfChild">
                                                    <Form.Label><strong> Name of the child, if any : </strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter name"
                                                        {...register("name")}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        (If not named, leave blank)
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <FormGroup className="mb-3" controlId="gender">
                                            <FormLabel><strong>Gender*</strong></FormLabel>
                                            <div className='genderOptions'>
                                                <Form.Check
                                                    type={'radio'}
                                                    label={'Male'}
                                                    id={`Male`}
                                                    defaultChecked
                                                    value={'Male'}
                                                    {...register("gender")}
                                                />
                                                <Form.Check
                                                    type={'radio'}
                                                    label={'Female'}
                                                    id={`Female`}
                                                    value={'Female'}
                                                    {...register("gender")}
                                                />
                                                <Form.Check
                                                    type={'radio'}
                                                    label={'Transgender'}
                                                    id={`Transgender`}
                                                    value={`Transgender`}
                                                    {...register("gender")}
                                                />
                                            </div>
                                        </FormGroup>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="nameOfFather">
                                                    <Form.Label><strong> Name of the father* :</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Name of father"
                                                        {...register("father_name",
                                                            {
                                                                required: 'Name of Father is required',
                                                                pattern: {
                                                                    value: /\S/g,
                                                                    message: "field cannot be empty"
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    message: "minimum 3 character required"
                                                                }
                                                            }
                                                        )}
                                                    />
                                                    {errors.father_name && <small className='field_error'>{errors.father_name.message}</small>}
                                                    <Form.Text className="text-muted">
                                                        (Full name as usually written) UID No of Father (if any)
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="nameOfMother">
                                                    <Form.Label><strong> Name of the mother* : </strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Name of mother"
                                                        {...register("mother_name",
                                                            {
                                                                required: 'Name of Mother is required',
                                                                pattern: {
                                                                    value: /\S/g,
                                                                    message: "field cannot be empty"
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    message: "minimum 3 character required"
                                                                }
                                                            }
                                                        )}
                                                    />
                                                    {errors.mother_name && <small className='field_error'>{errors.mother_name.message}</small>}
                                                    <Form.Text className="text-muted">
                                                        (Full name as usually written) UID No of Mother (if any)
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3" controlId="AddressOfParents">
                                            <Form.Label><strong> Address of parents at the time of
                                                Birth of the Child* :</strong></Form.Label>
                                            <Form.Control type="text" placeholder="Address of parents"
                                                {...register("address_birth",
                                                    {
                                                        required: 'Address Of Parents is required',
                                                        pattern: {
                                                            value: /\S/g,
                                                            message: "field cannot be empty"
                                                        }
                                                    }
                                                )}
                                            />
                                            {errors.address_birth && <small className='field_error'>Address Of Parents is required</small>}
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="PermanentAddress">
                                            <Form.Label><strong>Permanent address of parents* :</strong></Form.Label>
                                            <Form.Control type="text" placeholder="Permanent address"
                                                {...register("address",
                                                    {
                                                        required: 'Permanent Address is required',
                                                        pattern: {
                                                            value: /\S/g,
                                                            message: "field cannot be empty"
                                                        }
                                                    }
                                                )}
                                            />
                                            {errors.address && <small className='field_error'>{errors.address.message}</small>}
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="PlaceOfBirth">
                                            <Form.Label><strong> Place of birth* : </strong></Form.Label>
                                            <Form.Control type="text" placeholder="Place of birth"
                                                {...register("placeofbirth",
                                                    {
                                                        required: 'Place Of Birth is required',
                                                        pattern: {
                                                            value: /\S/g,
                                                            message: "field cannot be empty"
                                                        }
                                                    }
                                                )}
                                            />
                                            {errors.placeofbirth && <small className='field_error'>{errors.placeofbirth.message}</small>}
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="nameOfHospital">
                                            <Form.Label><strong> Name of hospital* :</strong></Form.Label>
                                            <Form.Control type="text" placeholder="Name of hospital"
                                                {...register("hospital_name",
                                                    {
                                                        required: 'Name of Hospital is required',
                                                        pattern: {
                                                            value: /\S/g,
                                                            message: "field cannot be empty"
                                                        }
                                                    }
                                                )}
                                            />
                                            {errors.hospital_name && <small className='field_error'>{errors.hospital_name.message}</small>}
                                            <Form.Text className="text-muted">
                                                (Give the name
                                                of the Hospital/Institution where the birth took
                                                place)

                                            </Form.Text>
                                        </Form.Group>


                                        <Form.Group className="mb-3" controlId="BirthWeight">
                                            <Form.Label><strong> Birth Weight (in kgs.)</strong> </Form.Label>
                                            <Form.Control type="number" min={0} max={10} placeholder="Birth Weight"
                                                {...register("weight")}
                                            />
                                            <Form.Text className="text-muted">
                                                (if available)
                                            </Form.Text>
                                        </Form.Group>

                                        <Button variant="primary" className='w-100' type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {show && <SuccessModal />}
            </section>
        </>
    )
}