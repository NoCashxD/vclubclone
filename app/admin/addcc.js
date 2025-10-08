"use client"
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../credit-cards/page.css"
import "./page.css"


const Addcc = () => {

  const [isloader, setIsloader] = useState(false);

  const [formData, setFormData] = useState({
    ccnum: '',
    cvv: '',
    exp: '',
    bin: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    bankName: '',
    level: '',
    brand: '',
    types: '',
    bases: '',
    price: '',
    address : '',
    binfo : '',
    email: "",
    dob : '',
    phone : '',
    holder : '',
    sort_code : '',
    ip: '',
    checker : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value !== undefined ? value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloader(true);
    try {
        // Perform the POST request to add data to the SQL database
        const response = await fetch("/api/add-card", {
          method: "POST", // Use POST method to submit the data
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          toast.success("Card data added successfully");
          setFormData({
            bin: "",
            country: "",
            state: "",
            city: "",
            zip: "",
            bankName: "",
            level: "",
            brand: "",
            types: "",
            bases: "",
            price: "",
             address : '',
    binfo : '',
            email: "",
             dob : '',
    phone : '',
    name: '',
    sort_code : '',
    ip: '',
    checker : '',
          });
        } else {
          const errorData = await response.json();
          console.log(errorData.message);
          
          toast.error(`Failed to add card data: ${errorData.message}`);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsloader(false);
      }
    };

  return (
    <div className="admin-app">
      <div className="main-content admin-main">
          <div className= 'admin-form '>
            <form onSubmit={handleSubmit}>
              <div className='gap-6 flex flex-wrap'>
                <div className="form-row">
                  <label>Card Number</label>
                  <input type="text" name="ccnum" value={formData.ccnum} onChange={handleInputChange} placeholder="Enter Card Number" />
                </div>
                <div className="form-row">
                  <label>CVV</label>
                  <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="Enter Cvv" />
                </div>
                <div className="form-row">
                  <label>Expiry</label>
                  <input type="text" name="exp" value={formData.exp} onChange={handleInputChange} placeholder="Enter Exp" />
                </div>
                <div className="form-row">
                  <label>BIN</label>
                  <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="Enter BIN" />
                </div>
                <div className="form-row">
                  <label>Country</label>
                  <select placeholder="Enter Country" name="country" value={formData.country} onChange={handleInputChange}>
                  <option value="">All Countris</option>

        
        
<option>ARUBA</option>
<option>AFGHANISTAN</option>
<option>ANGOLA</option>
<option>ALBANIA</option>
<option>ANDORRA</option>
<option>UNITED ARAB EMIRATES</option>
<option>ARGENTINA</option>
<option>ARMENIA</option>
<option>AMERICAN SAMOA</option>
<option>ANTIGUA AND BARBUDA</option>
<option>AUSTRALIA</option>
<option>AUSTRIA</option>
<option>BURUNDI</option>
<option>BELGIUM</option>
<option>BENIN</option>
<option>BURKINA FASO</option>
<option>BULGARIA</option>
<option>BAHRAIN</option>
<option>BAHAMAS, THE</option>
<option>BOSNIA AND HERZEGOVINA</option>
<option>BELARUS</option>
<option>BELIZE</option>
<option>BERMUDA</option>
<option>BOLIVIA</option>
<option>BRAZIL</option>
<option>BARBADOS</option>
<option>BRUNEI DARUSSALAM</option>
<option>BHUTAN</option>
<option>BOTSWANA</option>
<option>CENTRAL AFRICAN REPUBLIC</option>
<option>CANADA</option>
<option>SWITZERLAND</option>
<option>CHANNEL ISLANDS</option>
<option>CHILE</option>
<option>CHINA</option>
<option>COTE D'IVOIRE</option>
<option>CAMEROON</option>
<option>CONGO, DEM. REP.</option>
<option>CONGO, REP.</option>
<option>COLOMBIA</option>
<option>COMOROS</option>
<option>CABO VERDE</option>
<option>COSTA RICA</option>
<option>CUBA</option>
<option>CURAÇAO</option>
<option>CAYMAN ISLANDS</option>
<option>CYPRUS</option>
<option>CZECH REPUBLIC</option>
<option>GERMANY</option>
<option>DJIBOUTI</option>
<option>DOMINICA</option>
<option>DENMARK</option>
<option>DOMINICAN REPUBLIC</option>
<option>ALGERIA</option>
<option>ECUADOR</option>
<option>EGYPT, ARAB REP.</option>
<option>ERITREA</option>
<option>SPAIN</option>
<option>ESTONIA</option>
<option>ETHIOPIA</option>
<option>FINLAND</option>
<option>FIJI</option>
<option>FRANCE</option>
<option>FAROE ISLANDS</option>
<option>MICRONESIA, FED. STS.</option>
<option>GABON</option>
<option>UNITED KINGDOM</option>
<option>GEORGIA</option>
<option>GHANA</option>
<option>GIBRALTAR</option>
<option>GUINEA</option>
<option>GAMBIA, THE</option>
<option>GUINEA-BISSAU</option>
<option>EQUATORIAL GUINEA</option>
<option>GREECE</option>
<option>GRENADA</option>
<option>GREENLAND</option>
<option>GUATEMALA</option>
<option>GUAM</option>
<option>GUYANA</option>
<option>HONG KONG SAR, CHINA</option>
<option>HONDURAS</option>
<option>CROATIA</option>
<option>HAITI</option>
<option>HUNGARY</option>
<option>INDONESIA</option>
<option>ISLE OF MAN</option>
<option>INDIA</option>
<option>IRELAND</option>
<option>IRAN, ISLAMIC REP.</option>
<option>IRAQ</option>
<option>ICELAND</option>
<option>ISRAEL</option>
<option>ITALY</option>
<option>JAMAICA</option>
<option>JORDAN</option>
<option>JAPAN</option>
<option>KAZAKHSTAN</option>
<option>KENYA</option>
<option>KYRGYZ REPUBLIC</option>
<option>CAMBODIA</option>
<option>KIRIBATI</option>
<option>ST. KITTS AND NEVIS</option>
<option>KOREA, REP.</option>
<option>KUWAIT</option>
<option>LAO PDR</option>
<option>LEBANON</option>
<option>LIBERIA</option>
<option>LIBYA</option>
<option>ST. LUCIA</option>
<option>LIECHTENSTEIN</option>
<option>SRI LANKA</option>
<option>LESOTHO</option>
<option>LITHUANIA</option>
<option>LUXEMBOURG</option>
<option>LATVIA</option>
<option>MACAO SAR, CHINA</option>
<option>ST. MARTIN (FRENCH PART)</option>
<option>MOROCCO</option>
<option>MONACO</option>
<option>MOLDOVA</option>
<option>MADAGASCAR</option>
<option>MALDIVES</option>
<option>MEXICO</option>
<option>MARSHALL ISLANDS</option>
<option>MACEDONIA, FYR</option>
<option>MALI</option>
<option>MALTA</option>
<option>MYANMAR</option>
<option>MONTENEGRO</option>
<option>MONGOLIA</option>
<option>NORTHERN MARIANA ISLANDS</option>
<option>MOZAMBIQUE</option>
<option>MAURITANIA</option>
<option>MAURITIUS</option>
<option>MALAWI</option>
<option>MALAYSIA</option>
<option>NAMIBIA</option>
<option>NEW CALEDONIA</option>
<option>NIGER</option>
<option>NIGERIA</option>
<option>NICARAGUA</option>
<option>NETHERLANDS</option>
<option>NORWAY</option>
<option>NEPAL</option>
<option>NAURU</option>
<option>NEW ZEALAND</option>
<option>OMAN</option>
<option>PAKISTAN</option>
<option>PANAMA</option>
<option>PERU</option>

<option>PHILIPPINES</option>
<option>PALAU</option>
<option>PAPUA NEW GUINEA</option>
<option>POLAND</option>
<option>PUERTO RICO</option>
<option>KOREA, DEM. PEOPLE’S REP.</option>
<option>PORTUGAL</option>
<option>PARAGUAY</option>
<option>WEST BANK AND GAZA</option>
<option>FRENCH POLYNESIA</option>
<option>QATAR</option>
<option>ROMANIA</option>
<option>RWANDA</option>
<option>SAUDI ARABIA</option>
<option>SUDAN</option>
<option>SENEGAL</option>
<option>SINGAPORE</option>
<option>SOLOMON ISLANDS</option>
<option>SIERRA LEONE</option>
<option>EL SALVADOR</option>
<option>SAN MARINO</option>
<option>SOMALIA</option>
<option>SERBIA</option>
<option>SOUTH SUDAN</option>
<option>SAO TOME AND PRINCIPE</option>
<option>SURINAME</option>
<option>SLOVAK REPUBLIC</option>
<option>SLOVENIA</option>
<option>SWEDEN</option>
<option>SINGAPORE</option>
<option>ST. HELENA</option>
<option>SLOVENIA</option>
<option>SVALBARD AND JAN MAYEN ISLANDS</option>
<option>SLOVAKIA</option>
<option>SIERRA LEONE</option>
<option>SAN MARINO</option>
<option>SENEGAL</option>
<option>SOMALIA</option>
<option>SURINAME</option>
<option>SOUTH SUDAN</option>
<option>SAO TOME AND PRINCIPE</option>
<option>EL SALVADOR</option>
<option>SINT MAARTEN (DUTCH PART)</option>
<option>SYRIAN ARAB REPUBLIC</option>
<option>SWAZILAND</option>
<option>TURKS AND CAICOS ISLANDS</option>
<option>CHAD</option>
<option>FRENCH SOUTHERN TERRITORIES</option>
<option>TOGO</option>
<option>THAILAND</option>
<option>TAJIKISTAN</option>
<option>TOKELAU</option>
<option>TURKMENISTAN</option>
<option>TIMOR-LESTE</option>
<option>TONGA</option>
<option>TRINIDAD AND TOBAGO</option>
<option>TUVALU</option>
<option>TANZANIA</option>
<option>UKRAINE</option>
<option>UGANDA</option>
<option>U.S. MINOR OUTLYING ISLANDS</option>
<option>UNITED STATES</option>
<option>URUGUAY</option>
<option>UZBEKISTAN</option>
<option>VATICAN CITY STATE</option>
<option>ST. VINCENT AND THE GRENADINES</option>
<option>VENEZUELA, RB</option>
<option>VIET NAM</option>
<option>VANUATU</option>
<option>WALLIS AND FUTUNA ISLANDS</option>
<option>SAMOA</option>
<option>YEMEN</option>
<option>MAYOTTE</option>
<option>SOUTH AFRICA</option>
<option>ZAMBIA</option>
<option>ZIMBABWE</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>State</label>
                  <input placeholder="Enter State" name="state" value={formData.state} onChange={handleInputChange}/>
                   
                </div>
                <div className="form-row">
                  <label>City</label>
                  <input placeholder="Enter City    " name="city" value={formData.city} onChange={handleInputChange}/>
                </div>
                <div className="form-row">
                  <label>ZIP</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="Enter ZIP" />
                </div>
                <div className="form-row">
                  <label>Bank Name</label>
                  <input name="bankName"  placeholder="Enter Bank Name"value={formData.bankName} onChange={handleInputChange}/>
                </div>
                <div className="form-row">
                  <label>Level</label>
                  <select name="level" value={formData.level} onChange={handleInputChange}>
            <option value="">All Levels</option>
            <option>PREPAID</option>
            <option>ATM</option>
            <option>PLATINUM</option>
            <option>CLASSIC</option>
            <option>PREMIUM</option>
            <option>STANDARD</option>
            <option>TITANIUM</option>
            <option>BUSINESS</option>
            <option>WORLD</option>
            <option>GOLD</option>
            <option>CORPORATE</option>
            <option>GIFT</option>
            <option>BLACK</option>
            <option>GREEN</option>
            <option>PROPRIETAR</option>
            <option>OUR CARD</option>
            <option>SHINHAN CAR</option>
            <option>SILVER</option>
            <option>PURCHASING</option>
            <option>CORPORATE GOLD</option>
            <option>NH PLATINUM</option>
            <option>OTHER</option>
            <option>PERSONAL</option>
            <option>CENTURION</option>
            <option>BLUE</option>
            <option>OPTIMA</option>
            <option>PREMIUM PLUS</option>
            <option>GOLD BUSINESS</option>
            <option>PLATINUM BUSINESS</option>
            <option>SMALL BUSINESS</option>
            <option>ULTIMATE</option>
            <option>REVOLVING</option>
            <option>GIFT/PREPAID</option>
            <option>ELECTRON</option>
            <option>INFINITE</option>
            <option>SIGNATURE</option>
            <option>REWARDS</option>
            <option>CORPORATE T&amp;E</option>
            <option>VIRTUAL</option>
            <option>V PAY</option>
            <option>PLATINUM REWARD</option>
            <option>PRIVATE LABEL</option>
            <option>T</option>
            <option>PROPRIETOR</option>
            <option>SEARS</option>
            <option>STANDARD/BUSINESS</option>
            <option>STANDARD/WORLD/PREPAID</option>
            <option>WORLD BLAC</option>
            <option>GOLD/WORLD</option>
            <option>PREPAID GOVERNMEN</option>
            <option>STANDARD/PREPAID</option>
            <option>GOVERNMENT PREPAID</option>
            <option>BUSINESS </option>
            <option>BUSINESS WORLD</option>
            <option>STANDARD UNEMBOSSED</option>
            <option>STANDARD/GOLD</option>
            <option>STANDARD/GOLD/PLATINUM</option>
            <option>PLATINUM/WORLD/TITANIUM/BUSINESS</option>
            <option>WORLD ELIT</option>
            <option>BUSINESS/STANDARD</option>
            <option>STANDARD/WORLD</option>
            <option>GOLD/STANDARD</option>
            <option>GOLD/PLATINUM</option>
            <option>HSA NON-SUBSTANTIATE</option>
            <option>TITANUM</option>
            <option>STANDARD/WORLD/GOLD/PLATINUM</option>
            <option>HEALTH SAVING</option>
            <option>PREPAID CORPORATE</option>
            <option>STANDARD/BUSINESS/PREPAID</option>
            <option>CORPORATE/BUSINESS</option>
            <option>CORPORATE/PREPAID</option>
            <option>BUSINESS PREPAID</option>
            <option>WORLD/PLATINUM</option>
            <option>CORPORATE/PURCHASIN</option>
            <option>PLATINUM/WORLD</option>
            <option>PREPAID/GIF</option>
            <option>PREPAID CORPORATE/PREPAID</option>
            <option>TITANIUM/GOLD</option>
            <option>STANDARD PREPAID</option>
            <option>STANDARD/PREPAID/WORLD</option>
            <option>PREPAID/STANDARD</option>
            <option>PRIVATE LABEL/PRIVATE LABEL/PREPA</option>
            <option>WORLD/STANDAR</option>
            <option>CREDIT</option>
            <option>CORPORATE CAR</option>
            <option>STANDARD/GOLD/TITANIU</option>
            <option>PLATINUM/GOLD</option>
            <option>PLATINUM/STANDART</option>
            <option>PLATINUM/TITANIU</option>
            <option>BUSINESS/CORPORATE</option>
            <option>WORLD/STANDARD</option>
            <option>GOLD/STANDARD/PLATINUM</option>
            <option>GOLD/BUSINESS</option>
            <option>STANDARD UNEMBOSSED/STANDARD</option>
            <option>WORLD/CORPORATE</option>
            <option>VIRTUAL BUSINESS</option>
            <option>FLEET</option>
            <option>PURCHASING/CORPORATE</option>
            <option>GOLD/CORPORATE</option>
            <option>GOLD/STANDARD/TITANIUM/PLATINUM</option>
            <option>CORPORATE PURCHASIN</option>
            <option>CORPORATE FLEE</option>
            <option>FLEET/BUSINESS</option>
            <option>COMMERCIAL</option>
            <option>GOVERNMENT COMMERCIA</option>
            <option>GSA</option>
            <option>STANDARD/GOLD/PLATINUM/WORLD</option>
            <option>STANDARD/PLATINUM</option>
            <option>ATM ONLY</option>
            <option>PREPAID/REWARDS</option>
            <option>BUSINESS/PREPAID/STANDARD/REWARD</option>
            <option>STANDARD/REWARD</option>
            <option>PREPAID/STANDARD/REWARDS</option>
            <option>PREPAID/STANDARD/REWARDS/BUSINESS</option>
            <option>PREMIUM/REWARDS/PREPAID</option>
            <option>BUSINESS/PREPAID/STANDART</option>
            <option>Q-CASH</option>
            <option>ICARD</option>
            <option>PROPRIETARY</option>
            <option>PAYMENT CAR</option>
            <option>EXECUTIVE BUSINESS</option>
            <option>PRIVATE</option>
            <option>ATM ONLY - CASHLINE CAR</option>
            <option>PROPRIETARY/STANDART</option>
            <option>PROPRIETARY/PREPAID</option>
        
                  </select>
                </div>
                <div className="form-row">
                  <label>Brand</label>
                  <select name="brand" value={formData.brand} onChange={handleInputChange}>
                
        <option value="">All Brands</option>
        <option value="local_card">LOCAL CARD</option>
        <option value="mir">MIR</option>
        <option value="mastercard">MASTERCARD</option>
        <option value="diners_club">DINERS CLUB</option>
        <option value="amex">AMEX</option>
        <option value="jcb">JCB</option>
        <option value="visa">VISA</option>
        <option value="maestro">MAESTRO</option>
        <option value="ebt">EBT</option>
        <option value="rupay">RUPAY</option>
        <option value="elocard">ELOCARD</option>
        <option value="eftpos">EFTPOS</option>
        <option value="cabal">CABAL</option>
        <option value="discover">DISCOVER</option>
        <option value="china_unionpay">CHINA UNIONPAY</option>
        <option value="sbercard">SBERCARD</option>
        <option value="nsme">NSMEP</option>
        <option value="dinacard">DINACARD</option>
        <option value="comproc">COMPROCARD</option>
    </select>

                </div>
                <div className="form-row">
                  <label>Type</label>
                  <select name="types" value={formData.types} onChange={handleInputChange}>
                  <option value="">All Types</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                      <option value="standard">Standard</option>
                      <option value="ltd">LTD</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Bases</label>
                  <select name="bases" value={formData.bases} onChange={handleInputChange}>
        <option value="">All Bases</option>
        <option value="1000">⭐ DISCOUNTED REFUNDABLE [$4.90]</option>
        <option value="148">[15 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="147">[14 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="146">[13 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="145">[12 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="144">[09 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="143">[08 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="142">[07 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="141">[06 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="140">[05 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="139">[02 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="138">[01 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="137">[31 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="136">[30 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="135">[29 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="134">[26 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="133">[25 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="132">[24 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="131">[23 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="130">[22 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="129">[18 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="128">[15 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="127">[12 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="126">[11 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="125">[10 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="124">[09 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="123">[08 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="122">[05 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="121">[04 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="120">[03 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="119">[02 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="118">[01 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="117">[28 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="116">[27 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="115">[26 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="114">[25 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="113">[21 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="112">[20 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="111">[19 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="110">[18 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="109">[14 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="108">[13 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="107">[12 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="106">[11 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="105">[10 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="104">[07 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="103">[06 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="102">[05 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="101">[03 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="100">[31 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="99">[30 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="98">[29 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="97">[28 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="96">[27 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="95">[24 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="94">[23 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="93">[22 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="92">[21 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="91">[20 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="90">[17 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="89">[16 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="88">[15 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="87">[14 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="86">[13 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="85">[10 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="84">[09 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="83">[08 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="82">[07 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="81">[06 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="80">[03 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="79">[02 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="78">[01 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="77">[30 APR 2024] SNIFF US WORLD MIX</option>
        <option value="76">[29 APR 2024] SNIFF US WORLD MIX</option>
        <option value="75">[26 APR 2024] SNIFF US WORLD MIX</option>
        <option value="74">[25 APR 2024] SNIFF US WORLD MIX</option>
        <option value="73">[24 APR 2024] SNIFF US WORLD MIX</option>
        <option value="72">[23 APR 2024] SNIFF US WORLD MIX</option>
        <option value="71">[22 APR 2024] SNIFF US WORLD MIX</option>
        <option value="70">[18 APR 2024] SNIFF US WORLD MIX</option>
        <option value="69">[17 APR 2024] SNIFF US WORLD MIX</option>
        <option value="68">[16 APR 2024] SNIFF US WORLD MIX</option>
        <option value="67">[15 APR 2024] SNIFF US WORLD MIX</option>
        <option value="66">[12 APR 2024] SNIFF US WORLD MIX</option>
        <option value="65">[11 APR 2024] SNIFF US WORLD MIX</option>
        <option value="64">[10 APR 2024] SNIFF US WORLD MIX</option>
        <option value="63">[09 APR 2024] SNIFF US WORLD MIX</option>
        <option value="62">[08 APR 2024] SNIFF US WORLD MIX</option>
        <option value="61">[05 APR 2024] SNIFF US WORLD MIX</option>
        <option value="60">[04 APR 2024] SNIFF US WORLD MIX</option>
        <option value="59">[03 APR 2024] SNIFF US WORLD MIX</option>
        <option value="58">[02 APR 2024] SNIFF US WORLD MIX</option>
        <option value="57">[01 APR 2024] SNIFF US WORLD MIX</option>
        <option value="56">[29 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="55">[28 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="54">[27 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="53">[26 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="52">[25 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="51">[21 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="50">[20 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="49">[19 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="48">[18 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="47">[14 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="46">[13 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="45">[12 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="44">[11 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="43">[10 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="42">[07 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="41">[06 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="40">[05 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="39">[04 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="38">[01 MAR 2024] SNIFF US WORLD MIX</option>
    </select>
                </div>
                <div className="form-row">
                  <label>Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter Price" />
                </div>
                <div className="form-row">
                  <label>Address</label>
                  <input type='text' name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter Address" />
                </div>
                <div className="form-row">
                  <label>Bin Info</label>
                  <input name="binfo" value={formData.binfo} onChange={handleInputChange} placeholder="Enter Bin Info" />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input type='text' name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" />
                </div>
                <div className="form-row">
                  <label>Dob</label>
                  <input name="dob" value={formData.dob} onChange={handleInputChange} placeholder="Enter dob" />
                </div>
                <div className="form-row">
                  <label>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone" />
                </div>
                <div className="form-row">
                  <label>Name</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter Name" />
                </div>
                <div className="form-row">
                  <label>sort code</label>
                  <input name="sort_code" value={formData.sort_code} onChange={handleInputChange} placeholder="Enter sort code" />
                </div>
                <div className="form-row">
                  <label>ip</label>
                  <input name="ip" value={formData.ip} onChange={handleInputChange} placeholder="Enter ip" />
                </div>
                <div className="form-row">
                  <label>checker</label>
                  <input name="checker" value={formData.checker} onChange={handleInputChange} placeholder="Enter checker" />
                </div>
              </div>
              <div className="form-row">
                <button type="submit" className="submit">Add Card Data</button>
              </div>
            </form>
            {isloader && <h1>Loading.....</h1>}
            <ToastContainer />
          </div>
        </div>
      </div>
  );
};

export default Addcc;
