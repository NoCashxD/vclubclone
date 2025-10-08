  "use client"
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../credit-cards/page.css"
import "./page.css"


const Addbin = () => {

  const [isloader, setIsloader] = useState(false);

  const [formData, setFormData] = useState({
    bin: '',
    country: '',
    level: '',
    types: '',
    price: '',
    brand: '',
    description: ''
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
        const response = await fetch("/api/add-bin", {
          method: "POST", // Use POST method to submit the data
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          toast.success("Bin data added successfully");
          setFormData({
            bin: "",
            country: "",
            level: "",
            types: "",
            price: "",
            brand: "",
            description: ""
          });
        } else {
          const errorData = await response.json();
          console.log(errorData.message);
          toast.error(`Failed to add Bin data: ${errorData.message}`);
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
                  <label>BIN</label>
                  <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="Enter BIN" />
                </div>
                <div className="form-row">
                  <label>Country</label>
                  <select placeholder="Enter Country" name="country" value={formData.country} onChange={handleInputChange}>
                 <option value="" >Select Card Country</option>
<option value="AFGHANISTAN">AFGHANISTAN</option>
<option value="ALAND ISLANDS">ALAND ISLANDS</option>
<option value="ALBANIA">ALBANIA</option>
<option value="ALGERIA">ALGERIA</option>
<option value="AMERICAN SAMOA">AMERICAN SAMOA</option>
<option value="ANDORRA">ANDORRA</option>
<option value="ANGOLA">ANGOLA</option>
<option value="ANGUILLA">ANGUILLA</option>
<option value="ANTIGUA AND BARBUDA">ANTIGUA AND BARBUDA</option>
<option value="ARGENTINA">ARGENTINA</option>
<option value="ARMENIA">ARMENIA</option>
<option value="ARUBA">ARUBA</option>
<option value="ASCENSION ISLAND">ASCENSION ISLAND</option>
<option value="AUSTRALIA">AUSTRALIA</option>
<option value="AUSTRIA">AUSTRIA</option>
<option value="AZERBAIJAN">AZERBAIJAN</option>
<option value="BAHAMAS">BAHAMAS</option>
<option value="BAHRAIN">BAHRAIN</option>
<option value="BANGLADESH">BANGLADESH</option>
<option value="BARBADOS">BARBADOS</option>
<option value="BELARUS">BELARUS</option>
<option value="BELGIUM">BELGIUM</option>
<option value="BELIZE">BELIZE</option>
<option value="BENIN">BENIN</option>
<option value="BERMUDA">BERMUDA</option>
<option value="BHUTAN">BHUTAN</option>
<option value="BOLIVIA">BOLIVIA</option>
<option value="BOSNIA AND HERZEGOVINA">BOSNIA AND HERZEGOVINA</option>
<option value="BOTSWANA">BOTSWANA</option>
<option value="BOUVET ISLAND">BOUVET ISLAND</option>
<option value="BRAZIL">BRAZIL</option>
<option value="BRUNEI">BRUNEI</option>
<option value="BULGARIA">BULGARIA</option>
<option value="BURKINA FASO">BURKINA FASO</option>
<option value="BURUNDI">BURUNDI</option>
<option value="CAMBODIA">CAMBODIA</option>
<option value="CAMEROON">CAMEROON</option>
<option value="CANADA">CANADA</option>
<option value="CANARY ISLANDS">CANARY ISLANDS</option>
<option value="CAPE VERDE">CAPE VERDE</option>
<option value="CAYMAN ISLANDS">CAYMAN ISLANDS</option>
<option value="CENTRAL AFRICAN REPUBLIC">CENTRAL AFRICAN REPUBLIC</option>
<option value="CEUTA, MELILLA">CEUTA, MELILLA</option>
<option value="CHAD">CHAD</option>
<option value="CHILE">CHILE</option>
<option value="CHINA">CHINA</option>
<option value="CHRISTMAS ISLAND">CHRISTMAS ISLAND</option>
<option value="CLIPPERTON-ILE">CLIPPERTON-ILE</option>
<option value="COCOS [KEELING] ISLANDS">COCOS [KEELING] ISLANDS</option>
<option value="COLOMBIA">COLOMBIA</option>
<option value="COMOROS">COMOROS</option>
<option value="CONGO">CONGO</option>
<option value="CONGO (DEMOCRATIC REPUBLIC OF THE)">CONGO (DEMOCRATIC REPUBLIC OF THE)</option>
<option value="COOK ISLANDS">COOK ISLANDS</option>
<option value="COSTA RICA">COSTA RICA</option>
<option value="CÔTE D’IVOIRE">CÔTE D’IVOIRE</option>
<option value="CROATIA">CROATIA</option>
<option value="CUBA">CUBA</option>
<option value="CYPRUS">CYPRUS</option>
<option value="CZECH REPUBLIC">CZECH REPUBLIC</option>
<option value="DENMARK">DENMARK</option>
<option value="DIEGO GARCIA">DIEGO GARCIA</option>
<option value="DJIBOUTI">DJIBOUTI</option>
<option value="DOMINICA">DOMINICA</option>
<option value="DOMINICAN REPUBLIC">DOMINICAN REPUBLIC</option>
<option value="ECUADOR">ECUADOR</option>
<option value="EGYPT">EGYPT</option>
<option value="EL SALVADOR">EL SALVADOR</option>
<option value="EQUATORIAL GUINEA">EQUATORIAL GUINEA</option>
<option value="ERITREA">ERITREA</option>
<option value="ESTONIA">ESTONIA</option>
<option value="ETHIOPIA">ETHIOPIA</option>
<option value="FALKLAND ISLANDS">FALKLAND ISLANDS</option>
<option value="FAROE ISLANDS">FAROE ISLANDS</option>
<option value="FIJI">FIJI</option>
<option value="FINLAND">FINLAND</option>
<option value="FRANCE">FRANCE</option>
<option value="FRANCE, METROPOLITAN">FRANCE, METROPOLITAN</option>
<option value="FRENCH GUIANA">FRENCH GUIANA</option>
<option value="FRENCH POLYNESIA">FRENCH POLYNESIA</option>
<option value="FRENCH SOUTHERN TERRITORIES">FRENCH SOUTHERN TERRITORIES</option>
<option value="GABON">GABON</option>
<option value="GAMBIA">GAMBIA</option>
<option value="GEORGIA">GEORGIA</option>
<option value="GERMANY">GERMANY</option>
<option value="GHANA">GHANA</option>
<option value="GIBRALTAR">GIBRALTAR</option>
<option value="GREECE">GREECE</option>
<option value="GREENLAND">GREENLAND</option>
<option value="GRENADA">GRENADA</option>
<option value="GUADELOUPE">GUADELOUPE</option>
<option value="GUAM">GUAM</option>
<option value="GUATEMALA">GUATEMALA</option>
<option value="GUERNSEY">GUERNSEY</option>
<option value="GUINEA">GUINEA</option>
<option value="GUINEA-BISSAU">GUINEA-BISSAU</option>
<option value="GUYANA">GUYANA</option>
<option value="HAITI">HAITI</option>
<option value="HEARD ISLAND AND MCDONALD ISLANDS">HEARD ISLAND AND MCDONALD ISLANDS</option>
<option value="HONDURAS">HONDURAS</option>
<option value="HONG KONG">HONG KONG</option>
<option value="HUNGARY">HUNGARY</option>
<option value="ICELAND">ICELAND</option>
<option value="INDIA">INDIA</option>
<option value="INDONESIA">INDONESIA</option>
<option value="IRAN">IRAN</option>
<option value="IRAQ">IRAQ</option>
<option value="IRELAND">IRELAND</option>
<option value="ISLE OF MAN">ISLE OF MAN</option>
<option value="ISRAEL">ISRAEL</option>
<option value="ITALY">ITALY</option>
<option value="JAMAICA">JAMAICA</option>
<option value="JAPAN">JAPAN</option>
<option value="JERSEY">JERSEY</option>
<option value="JORDAN">JORDAN</option>
<option value="KAZAKHSTAN">KAZAKHSTAN</option>
<option value="KENYA">KENYA</option>
<option value="KIRIBATI">KIRIBATI</option>
<option value="KOSOVO">KOSOVO</option>
<option value="KUWAIT">KUWAIT</option>
<option value="KYRGYZSTAN">KYRGYZSTAN</option>
<option value="LAOS">LAOS</option>
<option value="LATVIA">LATVIA</option>
<option value="LEBANON">LEBANON</option>
<option value="LESOTHO">LESOTHO</option>
<option value="LIBERIA">LIBERIA</option>
<option value="LIBYA">LIBYA</option>
<option value="LIECHTENSTEIN">LIECHTENSTEIN</option>
<option value="LITHUANIA">LITHUANIA</option>
<option value="LUXEMBOURG">LUXEMBOURG</option>
<option value="MACAU">MACAU</option>
<option value="MACEDONIA">MACEDONIA</option>
<option value="MADAGASCAR">MADAGASCAR</option>
<option value="MALAWI">MALAWI</option>
<option value="MALAYSIA">MALAYSIA</option>
<option value="MALDIVES">MALDIVES</option>
<option value="MALI">MALI</option>
<option value="MALTA">MALTA</option>
<option value="MARSHALL ISLANDS">MARSHALL ISLANDS</option>
<option value="MARTINIQUE">MARTINIQUE</option>
<option value="MAURITANIA">MAURITANIA</option>
<option value="MAURITIUS">MAURITIUS</option>
<option value="MAYOTTE">MAYOTTE</option>
<option value="MEXICO">MEXICO</option>
<option value="MICRONESIA">MICRONESIA</option>
<option value="MOLDOVA">MOLDOVA</option>
<option value="MONACO">MONACO</option>
<option value="MONGOLIA">MONGOLIA</option>
<option value="MONTENEGRO">MONTENEGRO</option>
<option value="MONTSERRAT">MONTSERRAT</option>
<option value="MOROCCO">MOROCCO</option>
<option value="MOZAMBIQUE">MOZAMBIQUE</option>
<option value="MYANMAR [BURMA]">MYANMAR [BURMA]</option>
<option value="NAMIBIA">NAMIBIA</option>
<option value="NAURU">NAURU</option>
<option value="NEPAL">NEPAL</option>
<option value="NETHERLANDS">NETHERLANDS</option>
<option value="NETHERLANDS ANTILLES">NETHERLANDS ANTILLES</option>
<option value="NEW CALEDONIA">NEW CALEDONIA</option>
<option value="NEW ZEALAND">NEW ZEALAND</option>
<option value="NICARAGUA">NICARAGUA</option>
<option value="NIGER">NIGER</option>
<option value="NIGERIA">NIGERIA</option>
<option value="NIUE">NIUE</option>
<option value="NORFOLK ISLAND">NORFOLK ISLAND</option>
<option value="NORTH KOREA">NORTH KOREA</option>
<option value="NORTHERN MARIANA ISLANDS">NORTHERN MARIANA ISLANDS</option>
<option value="NORWAY">NORWAY</option>
<option value="OMAN">OMAN</option>
<option value="PAKISTAN">PAKISTAN</option>
<option value="PALAU">PALAU</option>
<option value="PALESTINIAN TERRITORIES">PALESTINIAN TERRITORIES</option>
<option value="PANAMA">PANAMA</option>
<option value="PAPUA NEW GUINEA">PAPUA NEW GUINEA</option>
<option value="PARAGUAY">PARAGUAY</option>
<option value="PERU">PERU</option>
<option value="PHILIPPINES">PHILIPPINES</option>
<option value="PITCAIRN ISLANDS">PITCAIRN ISLANDS</option>
<option value="POLAND">POLAND</option>
<option value="PORTUGAL">PORTUGAL</option>
<option value="PUERTO RICO">PUERTO RICO</option>
<option value="QATAR">QATAR</option>
<option value="RÉUNION">RÉUNION</option>
<option value="ROMANIA">ROMANIA</option>
<option value="RUSSIAN FEDERATION">RUSSIAN FEDERATION</option>
<option value="RWANDA">RWANDA</option>
<option value="SAINT HELENA">SAINT HELENA</option>
<option value="SAINT KITTS AND NEVIS">SAINT KITTS AND NEVIS</option>
<option value="SAINT LUCIA">SAINT LUCIA</option>
<option value="SAINT PIERRE AND MIQUELON">SAINT PIERRE AND MIQUELON</option>
<option value="SAINT VINCENT AND THE GRENADINES">SAINT VINCENT AND THE GRENADINES</option>
<option value="SAMOA">SAMOA</option>
<option value="SAN MARINO">SAN MARINO</option>
<option value="SÃO TOMÉ AND PRÍNCIPE">SÃO TOMÉ AND PRÍNCIPE</option>
<option value="SAUDI ARABIA">SAUDI ARABIA</option>
<option value="SENEGAL">SENEGAL</option>
<option value="SERBIA">SERBIA</option>
<option value="SEYCHELLES">SEYCHELLES</option>
<option value="SIERRA LEONE">SIERRA LEONE</option>
<option value="SINGAPORE">SINGAPORE</option>
<option value="SLOVAKIA">SLOVAKIA</option>
<option value="SLOVENIA">SLOVENIA</option>
<option value="SOLOMON ISLANDS">SOLOMON ISLANDS</option>
<option value="SOMALIA">SOMALIA</option>
<option value="SOUTH AFRICA">SOUTH AFRICA</option>
<option value="SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS">SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS</option>
<option value="SOUTH KOREA">SOUTH KOREA</option>
<option value="SPAIN">SPAIN</option>
<option value="SRI LANKA">SRI LANKA</option>
<option value="SUDAN">SUDAN</option>
<option value="SURINAME">SURINAME</option>
<option value="SVALBARD AND JAN MAYEN">SVALBARD AND JAN MAYEN</option>
<option value="SWAZILAND">SWAZILAND</option>
<option value="SWEDEN">SWEDEN</option>
<option value="SWITZERLAND">SWITZERLAND</option>
<option value="SYRIA">SYRIA</option>
<option value="TAIWAN">TAIWAN</option>
<option value="TAIWAN, PROVINCE OF CHINA">TAIWAN, PROVINCE OF CHINA</option>
<option value="TAJIKISTAN">TAJIKISTAN</option>
<option value="TANZANIA">TANZANIA</option>
<option value="THAILAND">THAILAND</option>
<option value="TIMOR-LESTE">TIMOR-LESTE</option>
<option value="TOGO">TOGO</option>
<option value="TOKELAU">TOKELAU</option>
<option value="TONGA">TONGA</option>
<option value="TRINIDAD AND TOBAGO">TRINIDAD AND TOBAGO</option>
<option value="TRISTAN DA CUNHA">TRISTAN DA CUNHA</option>
<option value="TUNISIA">TUNISIA</option>
<option value="TURKEY">TURKEY</option>
<option value="TURKMENISTAN">TURKMENISTAN</option>
<option value="TURKS AND CAICOS ISLANDS">TURKS AND CAICOS ISLANDS</option>
<option value="TUVALU">TUVALU</option>
<option value="U.S. MINOR OUTLYING ISLANDS">U.S. MINOR OUTLYING ISLANDS</option>
<option value="UGANDA">UGANDA</option>
<option value="UKRAINE">UKRAINE</option>
<option value="UNITED ARAB EMIRATES">UNITED ARAB EMIRATES</option>
<option value="UNITED KINGDOM">UNITED KINGDOM</option>
<option value="UNITED STATES">UNITED STATES</option>
<option value="URUGUAY">URUGUAY</option>
<option value="UZBEKISTAN">UZBEKISTAN</option>
<option value="VANUATU">VANUATU</option>
<option value="VATICAN CITY">VATICAN CITY</option>
<option value="VENEZUELA">VENEZUELA</option>
<option value="VIETNAM">VIETNAM</option>
<option value="VIRGIN ISLANDS (BRITISH)">VIRGIN ISLANDS (BRITISH)</option>
<option value="VIRGIN ISLANDS (U.S.)">VIRGIN ISLANDS (U.S.)</option>
<option value="WALLIS AND FUTUNA">WALLIS AND FUTUNA</option>
<option value="WESTERN SAHARA">WESTERN SAHARA</option>
<option value="YEMEN">YEMEN</option>
<option value="YUGOSLAVIA">YUGOSLAVIA</option>
<option value="ZAMBIA">ZAMBIA</option>
<option value="ZIMBABWE">ZIMBABWE</option>
</select>   
                </div>
                <div className="form-row">
                  <label>Level</label>
                  <select name="level" value={formData.level} onChange={handleInputChange}>
                  
<option value="">Select Card Level</option>
<option value="AARP">AARP</option>
<option value="ACCESS">ACCESS</option>
<option value="ACH FOR CONSUMER">ACH FOR CONSUMER</option>
<option value="ACQUIRER ONLY">ACQUIRER ONLY</option>
<option value="ACTIVATION VERIFICATION">ACTIVATION VERIFICATION</option>
<option value="AGRICULTURAL">AGRICULTURAL</option>
<option value="AGRO">AGRO</option>
<option value="AIR">AIR</option>
<option value="AIRMILES PREMIER">AIRMILES PREMIER</option>
<option value="ALIMENTACAO">ALIMENTACAO</option>
<option value="ALL-IN-ONE CARD">ALL-IN-ONE CARD</option>
<option value="ARMED POLICE SERVICEMAN GUARANTEE CARD">ARMED POLICE SERVICEMAN GUARANTEE CARD</option>
<option value="ATM">ATM</option>
<option value="ATM CARD">ATM CARD</option>
<option value="AUTO">AUTO</option>
<option value="B2B">B2B</option>
<option value="BASIC">BASIC</option>
<option value="BASICO">BASICO</option>
<option value="BC CARD">BC CARD</option>
<option value="BILL PAY COMMERCIAL">BILL PAY COMMERCIAL</option>
<option value="BIN WALLET MOBILE PAYMENT">BIN WALLET MOBILE PAYMENT</option>
<option value="BLACK">BLACK</option>
<option value="BLACK DIGITAL">BLACK DIGITAL</option>
<option value="BLUE">BLUE</option>
<option value="BLUE AIRMILES CASH BACK CARD">BLUE AIRMILES CASH BACK CARD</option>
<option value="BNDES">BNDES</option>
<option value="BUSAN BC CARD">BUSAN BC CARD</option>
<option value="BUSINESS">BUSINESS</option>
<option value="BUSINESS ELO MORE">BUSINESS ELO MORE</option>
<option value="BUSINESS ENHANCED">BUSINESS ENHANCED</option>
<option value="BUSINESS GRAPHITE">BUSINESS GRAPHITE</option>
<option value="BUSINESS INFINITE">BUSINESS INFINITE</option>
<option value="BUSINESS NANJING DINERS">BUSINESS NANJING DINERS</option>
<option value="BUSINESS PLATINUM">BUSINESS PLATINUM</option>
<option value="BUSINESS SIGNATURE">BUSINESS SIGNATURE</option>
<option value="BUSINESS TRAVEL">BUSINESS TRAVEL</option>
<option value="BUSINESS WORLD">BUSINESS WORLD</option>
<option value="BUSINESS WORLD ELITE">BUSINESS WORLD ELITE</option>
<option value="CARTE CIB">CARTE CIB</option>
<option value="CARTE DE RETRAIT JEUNE">CARTE DE RETRAIT JEUNE</option>
<option value="CARTE PRIVATIVE">CARTE PRIVATIVE</option>
<option value="CARTE PRIVATIVE EPARGNE">CARTE PRIVATIVE EPARGNE</option>
<option value="CARTE PRIVATIVE PIN ON-LINE">CARTE PRIVATIVE PIN ON-LINE</option>
<option value="CASH">CASH</option>
<option value="CENTRAL TRAVEL SOLUTIONS AIR">CENTRAL TRAVEL SOLUTIONS AIR</option>
<option value="CENTRAL TRAVEL SOLUTIONS LAND">CENTRAL TRAVEL SOLUTIONS LAND</option>
<option value="CENTURION">CENTURION</option>
<option value="CENTURY CARD">CENTURY CARD</option>
<option value="CHENXING CARD">CHENXING CARD</option>
<option value="CHINESE ROSE CARD">CHINESE ROSE CARD</option>
<option value="CHUFA CARD">CHUFA CARD</option>
<option value="CIRRUS">CIRRUS</option>
<option value="CITIZEN CARD">CITIZEN CARD</option>
<option value="CITY CARD">CITY CARD</option>
<option value="CLASSIC">CLASSIC</option>
<option value="CLASSIC/GOLD">CLASSIC/GOLD</option>
<option value="CLASSIC/PLATINUM">CLASSIC/PLATINUM</option>
<option value="CLASSIC/SIGNATURE">CLASSIC/SIGNATURE</option>
<option value="CMI">CMI</option>
<option value="COMBO">COMBO</option>
<option value="COMMERCIAL">COMMERCIAL</option>
<option value="COMMERCIAL AGRICULTURE">COMMERCIAL AGRICULTURE</option>
<option value="COMMERCIAL BILL PAY">COMMERCIAL BILL PAY</option>
<option value="COMMERCIAL MARKETPLACE">COMMERCIAL MARKETPLACE</option>
<option value="COMMERCIAL PAYMENT ACCOUNT">COMMERCIAL PAYMENT ACCOUNT</option>
<option value="COMMERCIAL PAYMENTS">COMMERCIAL PAYMENTS</option>
<option value="COMMERCIAL PUBLIC SECTOR">COMMERCIAL PUBLIC SECTOR</option>
<option value="COMMERCIAL REWARD FUNDING">COMMERCIAL REWARD FUNDING</option>
<option value="COMMERCIAL TRANSPORT">COMMERCIAL TRANSPORT</option>
<option value="CONSTRUCARD">CONSTRUCARD</option>
<option value="CONSUMER">CONSUMER</option>
<option value="COOPERATIVE CARD">COOPERATIVE CARD</option>
<option value="CORPORATE">CORPORATE</option>
<option value="CORPORATE DINERS">CORPORATE DINERS</option>
<option value="CORPORATE EXECUTIVE">CORPORATE EXECUTIVE</option>
<option value="CORPORATE FLEET">CORPORATE FLEET</option>
<option value="CORPORATE GOLD">CORPORATE GOLD</option>
<option value="CORPORATE GOLD CHARGE">CORPORATE GOLD CHARGE</option>
<option value="CORPORATE GREEN CHARGE">CORPORATE GREEN CHARGE</option>
<option value="CORPORATE GREEN REVOLVE">CORPORATE GREEN REVOLVE</option>
<option value="CORPORATE NANJING">CORPORATE NANJING</option>
<option value="CORPORATE NANJING DINERS">CORPORATE NANJING DINERS</option>
<option value="CORPORATE PURCHASING">CORPORATE PURCHASING</option>
<option value="CORPORATE T&amp;E">CORPORATE T&amp;E</option>
<option value="CORPORATE WORLD">CORPORATE WORLD</option>
<option value="CORPORATE WORLD ELITE">CORPORATE WORLD ELITE</option>
<option value="CORPORATE/INFINITE">CORPORATE/INFINITE</option>
<option value="CREDIT COEMITIDA">CREDIT COEMITIDA</option>
<option value="CULTURA">CULTURA</option>
<option value="DAEGU BC CARD">DAEGU BC CARD</option>
<option value="DAEGU BC CHECK">DAEGU BC CHECK</option>
<option value="DALIAN SOCIAL SECURITY CARD">DALIAN SOCIAL SECURITY CARD</option>
<option value="DATANGKA">DATANGKA</option>
<option value="DEFERRED DEBIT">DEFERRED DEBIT</option>
<option value="DELAYED DEBIT">DELAYED DEBIT</option>
<option value="DEPARTMENT STORE CARD">DEPARTMENT STORE CARD</option>
<option value="DIAMOND">DIAMOND</option>
<option value="DIGITAL ENABLEMENT PROGRAM">DIGITAL ENABLEMENT PROGRAM</option>
<option value="DISTRIBUTION">DISTRIBUTION</option>
<option value="ELECTRIC ORANGE">ELECTRIC ORANGE</option>
<option value="ELECTRON">ELECTRON</option>
<option value="ELECTRONIC">ELECTRONIC</option>
<option value="ELECTRONIC BUSINESS">ELECTRONIC BUSINESS</option>
<option value="ELECTRONIC COMMERCIAL">ELECTRONIC COMMERCIAL</option>
<option value="ELO MORE">ELO MORE</option>
<option value="EMERALD">EMERALD</option>
<option value="EMERGING CARD">EMERGING CARD</option>
<option value="EMPRESARIAL ELO MORE">EMPRESARIAL ELO MORE</option>
<option value="ENHANCED">ENHANCED</option>
<option value="ENTERPRISE SOLUTIONS">ENTERPRISE SOLUTIONS</option>
<option value="EUROPEAN REGULATED INDIVIDUAL PAY">EUROPEAN REGULATED INDIVIDUAL PAY</option>
<option value="EXECUTIVE">EXECUTIVE</option>
<option value="EXECUTIVE BUSINESS">EXECUTIVE BUSINESS</option>
<option value="EXECUTIVE CORPORATE">EXECUTIVE CORPORATE</option>
<option value="FINANCIAL PLAN CARD">FINANCIAL PLAN CARD</option>
<option value="FIRSTMONIE COMPANION">FIRSTMONIE COMPANION</option>
<option value="FLEET">FLEET</option>
<option value="FLEET CARD">FLEET CARD</option>
<option value="FLEET CONSUMER">FLEET CONSUMER</option>
<option value="FOOD">FOOD</option>
<option value="FOOD CARD">FOOD CARD</option>
<option value="FSA">FSA</option>
<option value="GEN CARD NUMBERS">GEN CARD NUMBERS</option>
<option value="GIFT">GIFT</option>
<option value="GIFT VOUCHER">GIFT VOUCHER</option>
<option value="GLOBAL PAYMENT">GLOBAL PAYMENT</option>
<option value="GM CARD">GM CARD</option>
<option value="GNS GOLD CHARGE">GNS GOLD CHARGE</option>
<option value="GNS GREEN CHARGE">GNS GREEN CHARGE</option>
<option value="GNS NETWORK CARD">GNS NETWORK CARD</option>
<option value="GNS PLATINUM CHARGE">GNS PLATINUM CHARGE</option>
<option value="GOLD">GOLD</option>
<option value="GOLD BUSINESS">GOLD BUSINESS</option>
<option value="GOLD DIGITAL">GOLD DIGITAL</option>
<option value="GOLD/CORPORATE">GOLD/CORPORATE</option>
<option value="GOLD/INFINITE/PLATINUM">GOLD/INFINITE/PLATINUM</option>
<option value="GOLD/PLATINUM">GOLD/PLATINUM</option>
<option value="GOLD/STANDARD">GOLD/STANDARD</option>
<option value="GOLD/WORLD ELITE">GOLD/WORLD ELITE</option>
<option value="GOLDEN BRIDGE CARD">GOLDEN BRIDGE CARD</option>
<option value="GOLDEN SPIKE">GOLDEN SPIKE</option>
<option value="GOVERNMENT COMMERCIAL">GOVERNMENT COMMERCIAL</option>
<option value="GOVERNMENT CORPORATE T&amp;E">GOVERNMENT CORPORATE T&amp;E</option>
<option value="GOVERNMENT PURCHASING">GOVERNMENT PURCHASING</option>
<option value="GOVERNMENT PURCHASING WITH FLEET">GOVERNMENT PURCHASING WITH FLEET</option>
<option value="GPP">GPP</option>
<option value="GRAPHITE">GRAPHITE</option>
<option value="GREEN">GREEN</option>
<option value="GREEN LEAF CARD">GREEN LEAF CARD</option>
<option value="GRMS CORPORATE CONTROL">GRMS CORPORATE CONTROL</option>
<option value="GUANGZHOU CARD">GUANGZHOU CARD</option>
<option value="GUANGZHOU CREDIT">GUANGZHOU CREDIT</option>
<option value="GYEONGNAM BC CARD">GYEONGNAM BC CARD</option>
<option value="HAN SKBC CARD">HAN SKBC CARD</option>
<option value="HAN SKBC CHECK">HAN SKBC CHECK</option>
<option value="HEALTHCARE">HEALTHCARE</option>
<option value="HELOC PLATINUM">HELOC PLATINUM</option>
<option value="HELOC STANDARD">HELOC STANDARD</option>
<option value="HENGTONG CARD">HENGTONG CARD</option>
<option value="HOTEL">HOTEL</option>
<option value="HSA NON-SUBSTANTIATED">HSA NON-SUBSTANTIATED</option>
<option value="HUITONG CARD">HUITONG CARD</option>
<option value="HYUNDAI CARD">HYUNDAI CARD</option>
<option value="IBK BC CARD">IBK BC CARD</option>
<option value="IBK BC CHECK">IBK BC CHECK</option>
<option value="IBK COMPANIES BC">IBK COMPANIES BC</option>
<option value="IBK INDUSTRIAL BANK">IBK INDUSTRIAL BANK</option>
<option value="IC CARD">IC CARD</option>
<option value="ICARD">ICARD</option>
<option value="IDENTITY">IDENTITY</option>
<option value="IKEA CARD">IKEA CARD</option>
<option value="IMMEDIATE DEBIT">IMMEDIATE DEBIT</option>
<option value="INDIVIDUAL">INDIVIDUAL</option>
<option value="INFINITE">INFINITE</option>
<option value="INFINITE PRIVILEGE">INFINITE PRIVILEGE</option>
<option value="INFINITE/PLATINUM">INFINITE/PLATINUM</option>
<option value="INFINITE/SIGNATURE">INFINITE/SIGNATURE</option>
<option value="INSTALLMENT PAYMENTS P">INSTALLMENT PAYMENTS P</option>
<option value="INSTALLMENT PAYMENTS S">INSTALLMENT PAYMENTS S</option>
<option value="INVALID">INVALID</option>
<option value="ISIC STUDENT">ISIC STUDENT</option>
<option value="JIAXIU CARD">JIAXIU CARD</option>
<option value="JIHE CARD">JIHE CARD</option>
<option value="JINDA CARD">JINDA CARD</option>
<option value="JINRUI CARD">JINRUI CARD</option>
<option value="JINSHAN MONEY LINK CARD">JINSHAN MONEY LINK CARD</option>
<option value="KB KOOKMIN CARD">KB KOOKMIN CARD</option>
<option value="KB NATIONAL BC CARD">KB NATIONAL BC CARD</option>
<option value="KIM BIKA">KIM BIKA</option>
<option value="KIRIN CARD">KIRIN CARD</option>
<option value="KYUSHU DEBIT">KYUSHU DEBIT</option>
<option value="LAROC INTERNATIONAL CORPORATE">LAROC INTERNATIONAL CORPORATE</option>
<option value="LOTTE CARD">LOTTE CARD</option>
<option value="LOTTE CORPORATION">LOTTE CORPORATION</option>
<option value="LOTTE PENTA">LOTTE PENTA</option>
<option value="LOTTE WEAVER SKY">LOTTE WEAVER SKY</option>
<option value="LOWES CARD">LOWES CARD</option>
<option value="MAESTRO">MAESTRO</option>
<option value="MASTERMONEY">MASTERMONEY</option>
<option value="MEEZA">MEEZA</option>
<option value="MICRO BUSINESS">MICRO BUSINESS</option>
<option value="MINZHOU CARD">MINZHOU CARD</option>
<option value="MIXED BIN">MIXED BIN</option>
<option value="MIXED PRODUCT">MIXED PRODUCT</option>
<option value="MUJER ACTIVA">MUJER ACTIVA</option>
<option value="MULTIPLO">MULTIPLO</option>
<option value="NANJING">NANJING</option>
<option value="NANJING DINERS">NANJING DINERS</option>
<option value="NATIONAL CUP ENTERPRISE CARD">NATIONAL CUP ENTERPRISE CARD</option>
<option value="NETWORK CARDS">NETWORK CARDS</option>
<option value="NEW WORLD">NEW WORLD</option>
<option value="NH CARD">NH CARD</option>
<option value="NH CHECK CARD">NH CHECK CARD</option>
<option value="NH CORPORATE CARD">NH CORPORATE CARD</option>
<option value="NH NONGHYUP BC CARD">NH NONGHYUP BC CARD</option>
<option value="NH NONGHYUP CHECK">NH NONGHYUP CHECK</option>
<option value="NH PLATINUM">NH PLATINUM</option>
<option value="NPF VERVE NFC">NPF VERVE NFC</option>
<option value="ONE CHECK CARD">ONE CHECK CARD</option>
<option value="ONE COMPANY CHECK">ONE COMPANY CHECK</option>
<option value="ONE CORPORATE CARD">ONE CORPORATE CARD</option>
<option value="OPEN BLUE REVOLVE">OPEN BLUE REVOLVE</option>
<option value="OPEN GOLD CHARGE">OPEN GOLD CHARGE</option>
<option value="OPEN GOLD REVOLVE">OPEN GOLD REVOLVE</option>
<option value="OPEN GREEN CHARGE">OPEN GREEN CHARGE</option>
<option value="OPEN GREEN REVOLVE">OPEN GREEN REVOLVE</option>
<option value="OPEN PLATINUM REVOLVE">OPEN PLATINUM REVOLVE</option>
<option value="OPTIMA">OPTIMA</option>
<option value="ORIENTAL CARD">ORIENTAL CARD</option>
<option value="OTHER">OTHER</option>
<option value="OTHER SCHEMES">OTHER SCHEMES</option>
<option value="OUR CARD">OUR CARD</option>
<option value="OUR CHECK CARD">OUR CHECK CARD</option>
<option value="PACIFIC">PACIFIC</option>
<option value="PAGAMENTO FORNECEDORES">PAGAMENTO FORNECEDORES</option>
<option value="PAYMENT CARD">PAYMENT CARD</option>
<option value="PAYPASS">PAYPASS</option>
<option value="PENSION">PENSION</option>
<option value="PEONY MONEY LINK">PEONY MONEY LINK</option>
<option value="PEONY QUASI-CREDIT CARD">PEONY QUASI-CREDIT CARD</option>
<option value="PERSONAL">PERSONAL</option>
<option value="PERSONAL BLACK CHARGE">PERSONAL BLACK CHARGE</option>
<option value="PERSONAL BLUE CHARGE">PERSONAL BLUE CHARGE</option>
<option value="PERSONAL BLUE REVOLVE">PERSONAL BLUE REVOLVE</option>
<option value="PERSONAL CHARGE">PERSONAL CHARGE</option>
<option value="PERSONAL GOLD CHARGE">PERSONAL GOLD CHARGE</option>
<option value="PERSONAL GOLD REVOLVE">PERSONAL GOLD REVOLVE</option>
<option value="PERSONAL GREEN CHARGE">PERSONAL GREEN CHARGE</option>
<option value="PERSONAL GREEN PREPAID">PERSONAL GREEN PREPAID</option>
<option value="PERSONAL GREEN REVOLVE">PERSONAL GREEN REVOLVE</option>
<option value="PERSONAL PLATINUM CHARGE">PERSONAL PLATINUM CHARGE</option>
<option value="PERSONAL PLATINUM REVOLVE">PERSONAL PLATINUM REVOLVE</option>
<option value="PERSONAL REVOLVE">PERSONAL REVOLVE</option>
<option value="PIN ONLY W/O EBT">PIN ONLY W/O EBT</option>
<option value="PLATINUM">PLATINUM</option>
<option value="PLATINUM DIGITAL">PLATINUM DIGITAL</option>
<option value="PLATINUM REWARDS">PLATINUM REWARDS</option>
<option value="PLATINUM SALARY">PLATINUM SALARY</option>
<option value="PLATINUM/STANDARD">PLATINUM/STANDARD</option>
<option value="PLATINUM/WORLD">PLATINUM/WORLD</option>
<option value="PLATINUM/WORLD ELITE/WORLD">PLATINUM/WORLD ELITE/WORLD</option>
<option value="PLATINUM/WORLD/STANDARD">PLATINUM/WORLD/STANDARD</option>
<option value="PMJDY">PMJDY</option>
<option value="PREFERRED BUSINESS">PREFERRED BUSINESS</option>
<option value="PREMIER">PREMIER</option>
<option value="PREMIUM">PREMIUM</option>
<option value="PREMIUM PLUS">PREMIUM PLUS</option>
<option value="PREPAID">PREPAID</option>
<option value="PREPAID AWARD">PREPAID AWARD</option>
<option value="PREPAID BUSINESS">PREPAID BUSINESS</option>
<option value="PREPAID BUSINESS ELECTRONIC">PREPAID BUSINESS ELECTRONIC</option>
<option value="PREPAID CASH">PREPAID CASH</option>
<option value="PREPAID COMMERCIAL">PREPAID COMMERCIAL</option>
<option value="PREPAID COMMERCIAL PAYMENT ACCOUNT">PREPAID COMMERCIAL PAYMENT ACCOUNT</option>
<option value="PREPAID COMMERCIAL TRANSPORT">PREPAID COMMERCIAL TRANSPORT</option>
<option value="PREPAID CONSUMER">PREPAID CONSUMER</option>
<option value="PREPAID CORPORATE">PREPAID CORPORATE</option>
<option value="PREPAID CORPORATE T&amp;E">PREPAID CORPORATE T&amp;E</option>
<option value="PREPAID ELECTRON">PREPAID ELECTRON</option>
<option value="PREPAID ELECTRONIC">PREPAID ELECTRONIC</option>
<option value="PREPAID EMPLOYEE INCENTIVE">PREPAID EMPLOYEE INCENTIVE</option>
<option value="PREPAID FLEX">PREPAID FLEX</option>
<option value="PREPAID FLEX BENEFIT">PREPAID FLEX BENEFIT</option>
<option value="PREPAID FOOD">PREPAID FOOD</option>
<option value="PREPAID FSA">PREPAID FSA</option>
<option value="PREPAID GOLD">PREPAID GOLD</option>
<option value="PREPAID GOLD PAYROLL">PREPAID GOLD PAYROLL</option>
<option value="PREPAID GOVERNMENT">PREPAID GOVERNMENT</option>
<option value="PREPAID HEALTHCARE">PREPAID HEALTHCARE</option>
<option value="PREPAID HEALTHCARE NON-TAX">PREPAID HEALTHCARE NON-TAX</option>
<option value="PREPAID HORIZON CLASSIC">PREPAID HORIZON CLASSIC</option>
<option value="PREPAID HSA NON-SUBSTANTIATED">PREPAID HSA NON-SUBSTANTIATED</option>
<option value="PREPAID HSA SUBSTANTIATED">PREPAID HSA SUBSTANTIATED</option>
<option value="PREPAID INSURANCE">PREPAID INSURANCE</option>
<option value="PREPAID ISIC">PREPAID ISIC</option>
<option value="PREPAID MEAL">PREPAID MEAL</option>
<option value="PREPAID NANJING">PREPAID NANJING</option>
<option value="PREPAID PAYROLL">PREPAID PAYROLL</option>
<option value="PREPAID PEDAGIO">PREPAID PEDAGIO</option>
<option value="PREPAID PJ PAYMENT ACCOUNT">PREPAID PJ PAYMENT ACCOUNT</option>
<option value="PREPAID PLATINUM">PREPAID PLATINUM</option>
<option value="PREPAID PLATINUM TRAVEL">PREPAID PLATINUM TRAVEL</option>
<option value="PREPAID PREFERRED BUSINESS">PREPAID PREFERRED BUSINESS</option>
<option value="PREPAID PRIVATE LABEL">PREPAID PRIVATE LABEL</option>
<option value="PREPAID PRIVATE LABEL BASIC">PREPAID PRIVATE LABEL BASIC</option>
<option value="PREPAID PRIVATE LABEL ENHANCED">PREPAID PRIVATE LABEL ENHANCED</option>
<option value="PREPAID PRIVATE LABEL PREMIUM">PREPAID PRIVATE LABEL PREMIUM</option>
<option value="PREPAID PRIVATE LABEL STANDARD">PREPAID PRIVATE LABEL STANDARD</option>
<option value="PREPAID PROPRIETARY ATM">PREPAID PROPRIETARY ATM</option>
<option value="PREPAID PURCHASING">PREPAID PURCHASING</option>
<option value="PREPAID PURCHASING WITH FLEET">PREPAID PURCHASING WITH FLEET</option>
<option value="PREPAID RELOADABLE">PREPAID RELOADABLE</option>
<option value="PREPAID STUDENT">PREPAID STUDENT</option>
<option value="PREPAID TEEN">PREPAID TEEN</option>
<option value="PREPAID TRAVEL">PREPAID TRAVEL</option>
<option value="PREPAID TRAVEL MONEY">PREPAID TRAVEL MONEY</option>
<option value="PREPAID VIRTUAL">PREPAID VIRTUAL</option>
<option value="PREPAID VOUCHER">PREPAID VOUCHER</option>
<option value="PREPAID VPAY">PREPAID VPAY</option>
<option value="PREPAID WORKPLACE B2B">PREPAID WORKPLACE B2B</option>
<option value="PREPAID WORLD">PREPAID WORLD</option>
<option value="PREPAID XPLORER">PREPAID XPLORER</option>
<option value="PRIORITY PLATINUM">PRIORITY PLATINUM</option>
<option value="PRIVATE LABEL">PRIVATE LABEL</option>
<option value="PRIVATE LABEL BASIC">PRIVATE LABEL BASIC</option>
<option value="PRIVATE LABEL TRADE PROGRAM">PRIVATE LABEL TRADE PROGRAM</option>
<option value="PROFESSIONAL">PROFESSIONAL</option>
<option value="PROPEIETARY">PROPEIETARY</option>
<option value="PROPRIETARY">PROPRIETARY</option>
<option value="PROPRIETARY ATM">PROPRIETARY ATM</option>
<option value="PROPRIETARY/STANDARD">PROPRIETARY/STANDARD</option>
<option value="PURCHASES">PURCHASES</option>
<option value="PURCHASING">PURCHASING</option>
<option value="PURCHASING CARD">PURCHASING CARD</option>
<option value="PURCHASING WITH FLEET">PURCHASING WITH FLEET</option>
<option value="Q-CASH">Q-CASH</option>
<option value="Q-CASH GENERAL">Q-CASH GENERAL</option>
<option value="QC STAFF">QC STAFF</option>
<option value="QILU CARD">QILU CARD</option>
<option value="QINGYUN CARD">QINGYUN CARD</option>
<option value="RETRAIT">RETRAIT</option>
<option value="RETRAIT INTERNE">RETRAIT INTERNE</option>
<option value="REWARDS">REWARDS</option>
<option value="RMB CARD">RMB CARD</option>
<option value="ROSE CARD">ROSE CARD</option>
<option value="RUPAY SELECT">RUPAY SELECT</option>
<option value="SALUTE">SALUTE</option>
<option value="SAMSUNG CARD">SAMSUNG CARD</option>
<option value="SAMSUNG CHECK">SAMSUNG CHECK</option>
<option value="SAMSUNG CHECK CARD">SAMSUNG CHECK CARD</option>
<option value="SC BC CARD">SC BC CARD</option>
<option value="SC BC CHECK">SC BC CHECK</option>
<option value="SEARS">SEARS</option>
<option value="SHINHAN BC CARD">SHINHAN BC CARD</option>
<option value="SHINHAN BC CHECK">SHINHAN BC CHECK</option>
<option value="SHINHAN CARD">SHINHAN CARD</option>
<option value="SHINHAN CARD - CHECK">SHINHAN CARD - CHECK</option>
<option value="SHINHAN CARD - CORPORATE">SHINHAN CARD - CORPORATE</option>
<option value="SHOP &amp; SPLIT">SHOP &amp; SPLIT</option>
<option value="SIGNATURE">SIGNATURE</option>
<option value="SIGNATURE BUSINESS">SIGNATURE BUSINESS</option>
<option value="SILVER">SILVER</option>
<option value="SMALL BUSINESS">SMALL BUSINESS</option>
<option value="SMALL CORPORATE">SMALL CORPORATE</option>
<option value="SOCIAL SECURITY CARD">SOCIAL SECURITY CARD</option>
<option value="SOCIAL SECURITY IC CARD">SOCIAL SECURITY IC CARD</option>
<option value="SPRING CITY CARD">SPRING CITY CARD</option>
<option value="SSANGYONG CARD">SSANGYONG CARD</option>
<option value="STANDARD">STANDARD</option>
<option value="STANDARD DIGITAL">STANDARD DIGITAL</option>
<option value="STANDARD/GOLD/TITANIUM">STANDARD/GOLD/TITANIUM</option>
<option value="STANDARD/PLATINUM">STANDARD/PLATINUM</option>
<option value="STANDARD/PLATINUM/WORLD">STANDARD/PLATINUM/WORLD</option>
<option value="STANDARD/WORLD">STANDARD/WORLD</option>
<option value="STUDENT">STUDENT</option>
<option value="SUPPLIERS PAYMENT">SUPPLIERS PAYMENT</option>
<option value="TITANIUM">TITANIUM</option>
<option value="TITANIUM/GOLD">TITANIUM/GOLD</option>
<option value="UATP">UATP</option>
<option value="UHNW">UHNW</option>
<option value="ULTIMATE">ULTIMATE</option>
<option value="ULTRA HIGH NET WORTH">ULTRA HIGH NET WORTH</option>
<option value="UNEMBOSSED">UNEMBOSSED</option>
<option value="UNIONPAY CARD">UNIONPAY CARD</option>
<option value="UNIT SETTLEMENT CARD">UNIT SETTLEMENT CARD</option>
<option value="V PAY">V PAY</option>
<option value="VERVE">VERVE</option>
<option value="VERVE CARD">VERVE CARD</option>
<option value="VERVE GLOBAL">VERVE GLOBAL</option>
<option value="VIRTUAL">VIRTUAL</option>
<option value="VOUCHER">VOUCHER</option>
<option value="VPAY">VPAY</option>
<option value="WHITE EMV INTERBANCAIRE">WHITE EMV INTERBANCAIRE</option>
<option value="WORLD">WORLD</option>
<option value="WORLD BLACK">WORLD BLACK</option>
<option value="WORLD BLACK EDITION">WORLD BLACK EDITION</option>
<option value="WORLD BUSINESS">WORLD BUSINESS</option>
<option value="WORLD ELITE">WORLD ELITE</option>
<option value="WORLD ELITE BUSINESS">WORLD ELITE BUSINESS</option>
<option value="WORLD ELITE EXCLUSIVE">WORLD ELITE EXCLUSIVE</option>
<option value="WORLD ELITE FOR BUSINESS">WORLD ELITE FOR BUSINESS</option>
<option value="WORLD FLEX">WORLD FLEX</option>
<option value="WORLD FOR BUSINESS">WORLD FOR BUSINESS</option>
<option value="WORLD REWARDS">WORLD REWARDS</option>
<option value="WORLD SIGNIA">WORLD SIGNIA</option>
<option value="WORLD/PLATINUM">WORLD/PLATINUM</option>
<option value="XINTONG CARD">XINTONG CARD</option>
<option value="YANGCHENG CARD">YANGCHENG CARD</option>
<option value="YANGTZE RIVER CARD">YANGTZE RIVER CARD</option>
<option value="YELLOW SEA CARD">YELLOW SEA CARD</option>
<option value="YINLU CARD">YINLU CARD</option>
<option value="YUANDU CARD">YUANDU CARD</option>
<option value="ZINKA">ZINKA</option>
</select>
                </div>
                
                <div className="form-row">
                  <label>Type</label>
                  <select name="types" value={formData.types} onChange={handleInputChange}>
                  <option value="">All Types</option>
                        <option value="CHARGE CARD">CHARGE CARD</option>
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>

                  </select>
                </div>
                <div className="form-row">
                  <label>Brand</label>
                  <select name="brand" value={formData.brand} onChange={handleInputChange}>
                  <option value="">All Brands</option>
                        <option value="CHARGE CARD">Visa</option>
                        <option value="CREDIT">MasterCard</option>

                  </select>
                </div>
                <div className="form-row">
                  <label>Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter Price" />
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter Description" />
                </div>
              </div>
              <div className="form-row">
                <button type="submit" className="submit">Add Bin Data</button>
              </div>
            </form>
            {isloader && <h1>Loading.....</h1>}
            <ToastContainer />
          </div>
        </div>
      </div>
  );
};

export default Addbin;
