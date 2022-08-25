import React, {useState} from "react";
import {FunctionComponent} from "react";
import {Button, Form, InputNumber, DatePicker, Select, Row, Col, message, Radio} from "antd";
import moment from "moment";
import "../styles.css"


type Params = {
    _name: string,
    _accId: string,
    _transferDate: string,
    _budget: string,
    _isParentAcc: boolean,
}

type BtnParams = {
    id: string,
    text: string,
    height: string,
    width: string,
    padding: string,
    onClick: React.MouseEventHandler<HTMLElement>,
}

const budgetType = {
    Ether: 0.000000001,
    Wei: 1000000000,
    Gwei: 1,
    Finney: 0.000001,
    TL: 1
}

const WithdrawMoney: FunctionComponent<Params> = ({_name, _accId, _transferDate, _budget, _isParentAcc}: Params) => {

//vars
    const [form] = Form.useForm()

    const [name, setName] = useState<string>(_name)
    const [accId, setAccId] = useState<string>(_accId)
    const [transferDate, setTransferDate] = useState<string>(_transferDate)
    const [budget, setBudget] = useState<string>(_budget)

    const dateFormatList = ['MM/DD/YYYY'];
    const [leftRadioClicked, setleftRadioClicked] = useState<boolean>(true)
    const [clickedRadioColor, setClickedRadioColor] = useState<string>("#40A9FF")

    const [newBudget, setNewBudget] = useState<number>(0);
    const [newDate, setNewDate] = useState<string>("")

//button onClickmethods
    const onClickSave = () => {
        console.log("save button clicked. New budget: " + newBudget)

        var change: number = newBudget

        if (newBudget != 0) {
            if (window.confirm('Yeni bilgileri kaydetmek istediğinize emin misiniz?')) {
                console.log("save button: accepted")

                if (leftRadioClicked) {
                    setBudget((parseInt(budget) + newBudget).toString())
                }
                else {
                    setBudget((parseInt(budget) + (-1 * newBudget)).toString())
                }
 
                message.info('Yeni bilgiler kaydedildi.');
            }
            else {
                console.log("save button: rejected")
            }
        }
        else {
            console.log("save button not valid")
        }
    }

    const onClickWithdraw = () => {
        console.log("save button clicked")

        if (window.confirm('Varlığı hesabınıza çekmek istediğinize emin misiniz?')) {
            console.log("save button: accepted")
            setBudget("0")
            
            //back-end com

            message.info('Para hesabınıza çekildi.');
        }
        else {
            console.log("save button: rejected")
        }
    }

//input onChange methods
    const onBudgetChange = (e: number) => {
        console.log("new budget input: " + e)
        setNewBudget(e)
    }

    const onDateChange = (e: any, dateString: string) => {
        console.log(dateString)
        setNewDate(dateString)
    }

    const formLayout = {
        labelCol: { span: 11},
        wrapperCol: { span: 13},
    };

//design components
    const getTitle = () => {
        var title: string
        var padding: string

        if (_isParentAcc) {
            title = "Varlık ve Devir Tarihini Düzenle"
            padding = "3%"
        }
        else {
            title = "Para Çek"
            padding = "10px"
        }

        return (
            <Row justify="center" className="child-header" style={{paddingTop: "75px", paddingBottom: "50px", paddingRight: padding}}>
                {title}
            </Row>
        )
    }

    const getRow = (leftStr: string, rightStr: string) => {
        return (
            <Form.Item
                label={<div className="child-left-text"> {leftStr} </div>}
                labelAlign="right"
            >
                <div className="child-text"> {rightStr} </div>
            </Form.Item>
        );
    }

    const btnParams: BtnParams = {
        id: _isParentAcc ? "parent-btn": "child-btn",
        text: _isParentAcc ? "Kaydet": "Parayı Çek",
        height: _isParentAcc ? "60px": "65px",
        width:  _isParentAcc ? "120px": "130px",
        padding: _isParentAcc ? "30px": "25px",
        onClick: _isParentAcc ? onClickSave: onClickWithdraw,
    }

//desing
    return (
        <div>
            {getTitle()}

            <Form {...formLayout}
                form={form}
                initialValues={{ remember: true }}
                autoComplete="off"
                colon={false}
            >

                {getRow("İsim Soyisim :", name)}
                {getRow("Hesap ID :", accId)}
                {getRow("Devir Tarihi :", transferDate)}
                {getRow("Varlık Miktarı :", budget)}

                {_isParentAcc &&                         
                    <div>
                        <Form.Item
                            label={<div className="child-left-text"> Yeni Miktar : </div>}
                            rules={[{ required: true, message: 'Lütfen miktarı giriniz.' }]}
                            labelAlign="right"
                        >
                            <Col>
                                <Row>
                                    <InputNumber
                                        id="transfer-amount" min={0} required={true}
                                        style={{width: "140px"}}
                                        onChange={(e) => e != null ? onBudgetChange(+e.valueOf()) : onBudgetChange(0)}
                                    />
                                    <Select defaultValue="Gwei" style={{ width: 100, paddingLeft: "10px" }}>
                                        <Select value="TL">TL</Select>
                                        <Select value="Wei">Wei</Select>
                                        <Select value="Gwei">Gwei</Select>
                                        <Select value="Finney">Finney</Select>
                                        <Select value="Ether">Ether</Select>
                                    </Select>
                                </Row>
                                <Row style={{paddingTop: "10px"}}>
                                    <Radio.Group style={{width: "140px"}}>
                                        <Radio.Button
                                            style={{color: "black", backgroundColor: leftRadioClicked ? clickedRadioColor: "", width: "70px"}}
                                            value="large" onClick={() => {setleftRadioClicked(true)}}
                                        >
                                            Ekle
                                        </Radio.Button>
                                        <Radio.Button
                                            style={{color: "black", backgroundColor: leftRadioClicked ? "": clickedRadioColor, width: "70px"}}
                                            value="large" onClick={() => {setleftRadioClicked(false)}}
                                        >
                                            Çıkar
                                        </Radio.Button>
                                    </Radio.Group>
                                </Row>
                            </Col>
                        </Form.Item>

                        <Form.Item
                            label={<div className="child-left-text"> Yeni Devir Tarihi : </div>}
                            labelAlign="right"
                        >
                            <DatePicker id="transfer-date" format={dateFormatList}
                                defaultValue={moment(transferDate, dateFormatList)}
                                allowClear={false} style={{width: "140px"}}
                                onChange={(e: any, dateString: string) => onDateChange(e,dateString)}
                            />
                        </Form.Item>
                    </div>
                }
            
                <Form.Item
                    wrapperCol={{ ...formLayout.wrapperCol, offset: 11 }}
                    style={{paddingTop: btnParams.padding}}
                >
                    <Button id={btnParams.id} type="primary" htmlType="submit"
                        className="std-button" style={{width: btnParams.width, height: btnParams.height}}
                        onClick={btnParams.onClick}
                    >
                        {btnParams.text}
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
}

export default WithdrawMoney;