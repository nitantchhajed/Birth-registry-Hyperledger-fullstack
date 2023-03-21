import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Table } from 'react-bootstrap'
import GovtOfTelangana from '../images/govt-of-telangana.png'
import Govt from '../images/national_em.png'
import Birth from '../images/birth-and-death.png'
import CheckedImg from '../images/tickmark.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
export default function BirthCertificatePreview() {
    const [UserFromData, setUserFromData] = useState(null)
    //for printing the form
    function PrintBirthCertificate() {
        window.print()
    }
    //getting the id from user 
    const slugs = useParams()
    useEffect(() => {
        getCertificateDetails()
    }, [])
    //get all data of the user 
    async function getCertificateDetails() {
        try {
            const { data: { data } } = await axios.get(`${process.env.REACT_APP_BASE_URL}api/v1/birthcertificate/getSingle/${slugs.id}`)
            setUserFromData(data)
        } catch (error) {
            console.log("cannot get certificate data", error);
            alert('something went wrong')
        }
    }

    return (
        <>
            {UserFromData !== null &&
                <section className='certificate_preview_page'>
                    <Container>
                        <Row>
                            <Col>
                                <div className='certificate_preview_box'>
                                    <div className='preview_head'>
                                        <Image src={Govt} fluid alt='logo' />
                                    </div>
                                    <div className='preview_head_logos'>
                                        <div className='medical_and_health'>
                                            <Image src={GovtOfTelangana} alt='medical' fluid />
                                        </div>
                                        <div className='preview_head_content'>
                                            <p>Form No.5</p>
                                            <h4 className='fw-bold'>తెలంగాణ ప్రభుత్వము</h4>
                                            <h4 className='fw-bold'>GOVERNMENT OF TELANGANA</h4>
                                            <h4 className='fw-bold'> వైద్య ఆరోగ్య శాఖ </h4>
                                            <h4 className='fw-bold'>HEALTH, MEDICAL & FAMILY WELFARE DEPARTMENT</h4>
                                            <h4 className='fw-bold text-danger'>జనన ధృవ పత్రము</h4>
                                            <h4 className='fw-bold text-danger mb-4'>BIRTH CERTIFICATE</h4>
                                        </div>
                                        <div className='birth_and_death'>
                                            <Image src={Birth} alt='birth' fluid />
                                        </div>
                                    </div>
                                    <div className='main_content'>
                                        {/* <h4>Birth Certificate</h4> */}
                                        <h6>(Issued under Section 12/17 of the Registration of Births and Deaths of the Registration of Births and Deaths Rules 1999)
                                            This is to certify that the following information has been taken from the original record of birth, which is the register for of GADWAL MUNICIPALITY Telangana State, India</h6>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '50%' }}>Name</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date of Birth</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.dob}</td>
                                                </tr>
                                                <tr>
                                                    <td>Gender</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td>Name of the father</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.father_name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Name of the mother</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.mother_name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Address of parents at the time of Birth</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.address_birth}</td>
                                                </tr>
                                                <tr>
                                                    <td>Permanent address of parents</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.address}</td>
                                                </tr>
                                                <tr>
                                                    <td>Place of birth</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.placeofbirth}</td>
                                                </tr>
                                                <tr>
                                                    <td>Name of hospital</td>
                                                    <td>:</td>
                                                    <td>{UserFromData.hospital_name}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className='digital__approval'>
                                        <div className='date'>Date : 20-Jun-2014</div>
                                        <div className='certifiedBy'>
                                            <Image src={CheckedImg} alt='checked' fluid />
                                            {/* <h6>Certified By</h6> */}
                                            <h6>Registrar of Births & Deaths</h6>
                                            <h6>GADWAL MUNICIPALITY</h6>
                                            <h6>Designation : MUNICIPAL COMMISSIONER</h6>
                                            {/* <h6>CIRCLE NO: 10, GHMC</h6> */}
                                        </div>
                                    </div>
                                    <p className='note'>Note: The information is as provided by Hospital authorities and does not require physical signature.And this certificate can verified at http://ubd.telangana.gov.in by furnishing the application number mentioned in the Certificate.</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='d-flex justify-content-center mt-4'>
                                    <button className='print_btn' onClick={PrintBirthCertificate}>Print</button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            }
        </>
    )
}
