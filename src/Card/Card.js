import React, { useState } from 'react'
import * as XSLX from 'xlsx'
import './Card.css'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import moment, { } from 'moment'
ChartJS.register(ArcElement, Tooltip, Legend);

function Card() {

    // on change states
    const [excelFile, setExcelFile] = useState(null);
    const [excelFileError, setExcelFileError] = useState(null);
    const [date, setDate] = useState(moment().subtract(1, 'days').format('L'))
    // submit
    const [excelData, setExcelData] = useState(null);
    
    
    // it will contain array of objects

    // handle File
    const fileType = ['application/vnd.ms-excel'];
    const handleFile = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            // console.log(selectedFile.type);
            if (selectedFile && fileType.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFileError(null);
                    setExcelFile(e.target.result);
                }
            }
            else {
                setExcelFileError('Please select only excel file types');
                setExcelFile(null);
            }
        }
        else {
            console.log('plz select your file');
        }
    }

    // submit function
    const handleSubmit = (e) => {
        e.preventDefault();
        if (excelFile !== null) {

            const workbook = XSLX.read(excelFile, { type: 'buffer' });
            //   const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets['Daily Report'];
            const data = XSLX.utils.sheet_to_json(worksheet);
            let output = [[], []]
            for (let i = 0; i < data.length; i++) {
                if (data[i].__EMPTY_3 === 'Actual oil delivered production (D) - bopd (QatarEnergy Std dipping)') {
                    output[0].push(data[i].__EMPTY_9)
                }
                if (data[i].__EMPTY_3 === 'Actual oil delivered production (D) - bopd (Coriolis)') {
                    output[1].push(data[i].__EMPTY_9)
                }
            }
            setExcelData(output);
            console.log(output)
        }
        else {
            setExcelData(null);
        }
    }

    return (
        <>



            <div className="container">



                {/* view file section */}
                <h5></h5>
                <div className='viewer'>
                    {excelData === null && <fieldset className='container'>
                        <div className='row'>
                            <div className='col-3'>
                                <img src={require('../IMG/TotalEnergies_logo.png')} className='img-fluid' alt='logo' />
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <h5 className='font-header'>Daily Production Details</h5>
                                    </div>
                                    <div className='col-6'>
                                        <p className='text-end font' style={{fontWeight:'bold'}}>Date : {date}</p>
                                    </div>
                                </div>
                                <div className='center'>
                                    <div >
                                        <p style={{ color: 'rgb(255, 99, 132)', textDecoration:'underline' }} className='text-center font'>QATARENERGY STD DIPPING   </p>
                                    </div>
                                        <br/>
                                    <div>
                                        <p style={{ color: 'rgb(54, 162, 235)', textDecoration:'underline' }} className='text-center font'>CORIOLIS </p>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'>
                                <Doughnut
                                    data={{
                                        labels: ['(QatarEnergy Std dipping)', '(Coriolis)'],
                                        datasets: [{
                                            label: '# of Votes',
                                            data: [],
                                            backgroundColor: [
                                                'rgb(255, 99, 132)',
                                                'rgb(54, 162, 235)'
                                            ],
                                            hoverOffset: 4,
                                        }]
                                    }}
                                    height={247}
                                    width={180}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        </div>
                    </fieldset>}
                    {excelData !== null && (
                        <fieldset className='container'>
                            <div className='row'>
                                <div className='col-3'>
                                    <img src={require('../IMG/TotalEnergies_logo.png')} className='img-fluid' alt='logo' />
                                </div>
                                <div className='col-6'>
                                     <div className='row'>
                                    <div className='col-6'>
                                        <h5 className='font-header'>Daily Production Details</h5>
                                    </div>
                                    <div className='col-6'>
                                        <p className='text-end font' style={{fontWeight:'bold'}}>Date : {date}</p>
                                    </div>
                                </div>
                                <div className='center'>
                                    <div >
                                        <p style={{ color: 'rgb(255, 99, 132)', textDecoration:'underline' }} className='text-center font'> QATARENERGY STD DIPPING  </p>
                                        <p style={{ color: 'rgb(255, 99, 132)' }} className='text-center'>{Math.round(excelData[0])}</p>
                                    </div>
                                        <br/>
                                    <div>
                                        <p className='text-center font' style={{ color: 'rgb(54, 162, 235)', textDecoration:'underline' }}> CORIOLIS </p>
                                        <p style={{ color: 'rgb(54, 162, 235)' }} className='text-center'>{Math.round(excelData[1])}</p>
                                        <br/>
                                    </div>
                                </div>
                                </div>
                                <div className='col-3'>
                                    <Doughnut
                                        data={{
                                            labels: ['(QatarEnergy Std dipping)', '(Coriolis)'],
                                            datasets: [{
                                                label: 'My First Dataset',
                                                data: [excelData[0], excelData[1]],
                                                backgroundColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',

                                                ],
                                                hoverOffset: 4,
                                            }]
                                        }}
                                        height={247}
                                        width={180}
                                        options={{ maintainAspectRatio: false }}
                                    />
                                </div>
                            </div>
                            <hr/>
                        </fieldset>

                    )}
                </div>

                {/* upload file section */}
                <div className=' d-grid gap-2 d-md-flex justify-content-md-end'>
                    <form className='form-group' autoComplete="off"
                        onSubmit={handleSubmit}>
                        <label><h5>Upload Excel file</h5></label>
                        <br></br>
                        <input type='file' className=''
                            onChange={handleFile} required></input>
                        {excelFileError && <div className='text-danger'
                            style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
                            <br/>
                        <button type='submit' className='btn btn-success'
                            style={{ marginTop: 5 + 'px' }}>Submit</button>
                    </form>
                </div>

                <br></br>
                <hr></hr>

            </div>

        </>
    )
}

export default Card