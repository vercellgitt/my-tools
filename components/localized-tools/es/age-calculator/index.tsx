"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "./style.css";
import { esAgeCalculatorFaqs } from "./faq";

type AgeResult = {
  years:number; months:number; days:number; totalMonths:number; totalWeeks:number;
  totalDays:number; totalHours:number; totalMinutes:number; totalSeconds:number;
  birthDay:string; zodiac:string; birthYear:number; leapYear:string; century:string;
  daysInBirthYear:number; daysLivedThisYear:number; nextBirthdayMonths:number;
  nextBirthdayDays:number; nextBirthdayHours:number; nextBirthdayMinutes:number;
  nextBirthdaySeconds:number; yearProgress:number;
};

const t = {
  "birth": "Fecha de nacimiento",
  "calculate": "Calcular la edad en la fecha",
  "hint": "Introduce tu fecha de nacimiento para mostrar tu edad y los resultados automáticamente.",
  "error": "La fecha de nacimiento no puede ser posterior a la fecha de cálculo.",
  "live": "Edad actualizada en tiempo real",
  "selected": "Resultado para la fecha seleccionada",
  "detail": "Tu edad al detalle",
  "stats": "Estadísticas de edad",
  "birthday": "Tiempo restante para tu próximo cumpleaños",
  "progress": "Progreso hasta el próximo cumpleaños",
  "copy": "Copiar resultado",
  "share": "Compartir",
  "print": "Imprimir",
  "reset": "Restablecer",
  "copied": "El resultado se ha copiado correctamente.",
  "copyfail": "No se pudo copiar automáticamente. Selecciona el resultado y cópialo.",
  "year": "Años",
  "month": "Meses",
  "day": "Días",
  "hours": "Horas",
  "minutes": "Minutos",
  "seconds": "Segundos",
  "totalMonths": "Meses totales",
  "totalWeeks": "Semanas totales",
  "totalDays": "Días totales",
  "totalHours": "Horas totales",
  "totalMinutes": "Minutos totales",
  "totalSeconds": "Segundos totales",
  "weekday": "Día de nacimiento",
  "zodiac": "Signo zodiacal",
  "birthYear": "Año de nacimiento",
  "leap": "Año bisiesto",
  "century": "Siglo",
  "birthYearDays": "Días del año de nacimiento",
  "elapsed": "Días transcurridos este año",
  "birthDate": "Fecha de nacimiento:",
  "calcDate": "Fecha de cálculo:",
  "h1": "Calculadora de edad: calcula tu edad en años, meses y días",
  "intro": "Utiliza esta calculadora de edad gratuita para conocer tu edad exacta según tu fecha de nacimiento y la fecha que elijas. La herramienta muestra años, meses y días, además del total de semanas, horas, minutos y segundos. También puedes conocer el día de la semana en que naciste y cuánto falta para tu próximo cumpleaños. Solo tienes que introducir tu fecha de nacimiento y el resultado aparecerá automáticamente.",
  "h2a": "Cómo utilizar la calculadora de edad",
  "pa": "Selecciona tu fecha de nacimiento en el primer campo. El segundo campo muestra automáticamente la fecha de hoy, pero puedes cambiarla para calcular tu edad en una fecha anterior. Los resultados aparecen cuando las fechas son válidas. Si eliges la fecha actual, los segundos y la cuenta atrás hasta tu cumpleaños se actualizan continuamente. Puedes copiar, compartir o imprimir el resultado.",
  "h2b": "¿Qué información muestra la herramienta para calcular la edad?",
  "pb": "La herramienta muestra tu edad en años, meses y días, así como el total de días, semanas, horas, minutos y segundos. También ofrece datos adicionales como el día de nacimiento, si el año fue bisiesto, el siglo y el signo zodiacal. La cuenta atrás te permite saber cuánto falta para tu próximo cumpleaños.",
  "h2c": "Cálculo de la edad y años bisiestos",
  "pc": "La edad se calcula comparando la fecha de nacimiento con la fecha elegida, teniendo en cuenta que los meses pueden tener distinta cantidad de días. Un año normal tiene 365 días y uno bisiesto tiene 366. La herramienta utiliza las reglas del calendario gregoriano para calcular los intervalos entre fechas.",
  "faqTitle": "Preguntas frecuentes sobre la calculadora de edad",
  "note": "Nota: esta herramienta calcula la edad según el calendario gregoriano y tiene fines informativos generales. El método oficial para calcular la edad puede variar según el país o la entidad correspondiente.",
  "yes": "Sí",
  "no": "No",
  "zodiacNames": [
    "Aries",
    "Tauro",
    "Géminis",
    "Cáncer",
    "Leo",
    "Virgo",
    "Libra",
    "Escorpio",
    "Sagitario",
    "Capricornio",
    "Acuario",
    "Piscis"
  ]
};
const number = (value:number) => new Intl.NumberFormat("es-ES").format(value);
const formatDate = (date:Date) => new Intl.DateTimeFormat("es-ES", {
  year:"numeric", month:"long", day:"numeric"
}).format(date);
const dateString = (date:Date) => {
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
};
const parseDate = (value:string) => {
  if(!value) return null;
  const [y,m,d]=value.split("-").map(Number);
  const date=new Date(y,m-1,d);
  return date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d ? date : null;
};
const daysInMonth=(year:number,month:number)=>new Date(year,month+1,0).getDate();
const leap=(year:number)=>year%4===0 && (year%100!==0 || year%400===0);
const zodiac=(day:number,month:number)=>{
  if((month===3&&day>=21)||(month===4&&day<=19)) return t.zodiacNames[0];
  if((month===4&&day>=20)||(month===5&&day<=20)) return t.zodiacNames[1];
  if((month===5&&day>=21)||(month===6&&day<=20)) return t.zodiacNames[2];
  if((month===6&&day>=21)||(month===7&&day<=22)) return t.zodiacNames[3];
  if((month===7&&day>=23)||(month===8&&day<=22)) return t.zodiacNames[4];
  if((month===8&&day>=23)||(month===9&&day<=22)) return t.zodiacNames[5];
  if((month===9&&day>=23)||(month===10&&day<=22)) return t.zodiacNames[6];
  if((month===10&&day>=23)||(month===11&&day<=21)) return t.zodiacNames[7];
  if((month===11&&day>=22)||(month===12&&day<=21)) return t.zodiacNames[8];
  if((month===12&&day>=22)||(month===1&&day<=19)) return t.zodiacNames[9];
  if((month===1&&day>=20)||(month===2&&day<=18)) return t.zodiacNames[10];
  return t.zodiacNames[11];
};
const ageParts=(birth:Date,target:Date)=>{
  let years=target.getFullYear()-birth.getFullYear();
  let months=target.getMonth()-birth.getMonth();
  let days=target.getDate()-birth.getDate();
  if(days<0){months--;days+=new Date(target.getFullYear(),target.getMonth(),0).getDate();}
  if(months<0){years--;months+=12;}
  return {years,months,days};
};
const nextBirthday=(birth:Date,now:Date)=>{
  const month=birth.getMonth(),day=birth.getDate();
  let year=now.getFullYear();
  let birthday=new Date(year,month,Math.min(day,daysInMonth(year,month)));
  if(birthday.getTime()<=now.getTime()){year++;birthday=new Date(year,month,Math.min(day,daysInMonth(year,month)));}
  const previous=new Date(year-1,month,Math.min(day,daysInMonth(year-1,month)));
  const remaining=Math.max(0,birthday.getTime()-now.getTime());
  const seconds=Math.floor(remaining/1000), minutes=Math.floor(seconds/60), hours=Math.floor(minutes/60), days=Math.floor(hours/24);
  const progress=((now.getTime()-previous.getTime())/(birthday.getTime()-previous.getTime()))*100;
  return {months:Math.floor(days/30),days:days%30,hours:hours%24,minutes:minutes%60,seconds:seconds%60,progress:Math.min(100,Math.max(0,progress))};
};
const calculate=(birth:Date,target:Date):AgeResult=>{
  const age=ageParts(birth,target);
  const bUTC=Date.UTC(birth.getFullYear(),birth.getMonth(),birth.getDate());
  const tUTC=Date.UTC(target.getFullYear(),target.getMonth(),target.getDate());
  const totalDays=Math.max(0,Math.floor((tUTC-bUTC)/86400000));
  const totalSeconds=Math.max(0,Math.floor((target.getTime()-birth.getTime())/1000));
  const next=nextBirthday(birth,target), year=birth.getFullYear();
  const start=new Date(target.getFullYear(),0,1), end=new Date(target.getFullYear()+1,0,1);
  const elapsed=Math.max(0,Math.floor((target.getTime()-start.getTime())/86400000));
  return {...age,
    totalMonths:(target.getFullYear()-birth.getFullYear())*12+target.getMonth()-birth.getMonth()-(target.getDate()<birth.getDate()?1:0),
    totalWeeks:Math.floor(totalDays/7),totalDays,totalHours:Math.floor(totalSeconds/3600),
    totalMinutes:Math.floor(totalSeconds/60),totalSeconds,
    birthDay:new Intl.DateTimeFormat("es-ES",{weekday:"long"}).format(birth),
    zodiac:zodiac(birth.getDate(),birth.getMonth()+1),birthYear:year,leapYear:leap(year)?t.yes:t.no,
    century:String(Math.floor((year-1)/100)+1),daysInBirthYear:leap(year)?366:365,
    daysLivedThisYear:elapsed,nextBirthdayMonths:next.months,nextBirthdayDays:next.days,
    nextBirthdayHours:next.hours,nextBirthdayMinutes:next.minutes,nextBirthdaySeconds:next.seconds,
    yearProgress:next.progress
  };
};

export default function SpanishAgeCalculator(){
  const [birthValue,setBirthValue]=useState("");
  const [calculationValue,setCalculationValue]=useState("");
  const [now,setNow]=useState(()=>new Date());
  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const [message,setMessage]=useState("");
  useEffect(()=>{
    setCalculationValue(dateString(new Date()));
    const timer=window.setInterval(()=>setNow(new Date()),1000);
    return ()=>window.clearInterval(timer);
  },[]);
  const birthDate=useMemo(()=>parseDate(birthValue),[birthValue]);
  const calculationDate=useMemo(()=>parseDate(calculationValue),[calculationValue]);
  const isToday=calculationValue===dateString(now);
  const result=useMemo(()=>{
    if(!birthDate||!calculationDate||birthDate.getTime()>calculationDate.getTime()) return null;
    return calculate(birthDate,isToday?now:calculationDate);
  },[birthDate,calculationDate,isToday,now]);
  const error=!!(birthValue&&calculationValue&&birthDate&&calculationDate&&birthDate.getTime()>calculationDate.getTime());
  const resultText=useMemo(()=>{
    if(!result||!birthDate||!calculationDate) return "";
    return [
      t.detail,`${result.years} ${t.year}, ${result.months} ${t.month}, ${result.days} ${t.day}`,
      `${t.totalMonths}: ${result.totalMonths}`,`${t.totalWeeks}: ${result.totalWeeks}`,
      `${t.totalDays}: ${result.totalDays}`,`${t.totalHours}: ${result.totalHours}`,
      `${t.totalMinutes}: ${result.totalMinutes}`,`${t.totalSeconds}: ${result.totalSeconds}`,
      `${t.weekday}: ${result.birthDay}`,`${t.zodiac}: ${result.zodiac}`,
      `${t.birthDate} ${formatDate(birthDate)}`,`${t.calcDate} ${formatDate(calculationDate)}`
    ].join("\n");
  },[result,birthDate,calculationDate]);
  const reset=useCallback(()=>{setBirthValue("");setCalculationValue(dateString(new Date()));setMessage("");},[]);
  const copyResult=async()=>{
    try{await navigator.clipboard.writeText(resultText);setMessage(t.copied);}
    catch{setMessage(t.copyfail);}
  };
  const shareResult=async()=>{
    if(navigator.share){try{await navigator.share({title:t.detail,text:resultText});}catch{/* share cancelled */}}
    else await copyResult();
  };
  const info = result ? [
    [t.totalMonths,result.totalMonths],[t.totalWeeks,result.totalWeeks],[t.totalDays,result.totalDays],
    [t.totalHours,result.totalHours],[t.totalMinutes,result.totalMinutes],[t.totalSeconds,result.totalSeconds],
    [t.weekday,result.birthDay],[t.zodiac,result.zodiac],[t.birthYear,result.birthYear],
    [t.leap,result.leapYear],[t.century,result.century],[t.birthYearDays,result.daysInBirthYear],
    [t.elapsed,result.daysLivedThisYear]
  ] as [string,string|number][] : [];
  const ageBoxes = result ? [
    ["years",t.year,result.years],["months",t.month,result.months],["days",t.day,result.days]
  ] as [string,string,number][] : [];
  const countdown = result ? [
    [t.month,result.nextBirthdayMonths],[t.day,result.nextBirthdayDays],
    [t.hours,result.nextBirthdayHours],[t.minutes,result.nextBirthdayMinutes],[t.seconds,result.nextBirthdaySeconds]
  ] as [string,number][] : [];

  return <div className="calculator-agee1" dir="ltr">
    <div className="calculator-agee2">
      <section className="calculator-agee3">
        <div className="calculator-agee4">
          <div className="calculator-agee5"><label htmlFor="agee-birth-date">{t.birth}</label>
            <input id="agee-birth-date" type="date" value={birthValue} max={dateString(now)} onChange={e=>{setBirthValue(e.target.value);setMessage("");}}/>
          </div>
          <div className="calculator-agee5"><label htmlFor="agee-calculate-date">{t.calculate}</label>
            <input id="agee-calculate-date" type="date" value={calculationValue} min={birthValue||undefined} max={dateString(now)} onChange={e=>{setCalculationValue(e.target.value);setMessage("");}}/>
          </div>
        </div>
        {error&&<p className="calculator-agee-error" role="alert">{t.error}</p>}
        {!birthValue&&<p className="calculator-agee-hint">{t.hint}</p>}
        {result&&<div className="calculator-agee-result">
          <div className="calculator-agee-live"><span className="calculator-agee-dot"/>{isToday?t.live:t.selected}</div>
          <h2 className="calculator-agee-result-title">{t.detail}</h2>
          <div className="calculator-agee-age-grid">{ageBoxes.map(([key,label,value])=><div className="calculator-agee-age-box" key={key}><strong>{number(value)}</strong><span>{label}</span></div>)}</div>
          <h3 className="calculator-agee-section-title">{t.stats}</h3>
          <div className="calculator-agee-info-grid">{info.map(([label,value])=><div className="calculator-agee-info-card" key={label}><span>{label}</span><strong>{typeof value==="number"?number(value):value}</strong></div>)}</div>
          <div className="calculator-agee-birthday"><h3>{t.birthday}</h3>
            <div className="calculator-agee-count-grid">{countdown.map(([label,value])=><div className="calculator-agee-count-box" key={label}><strong>{number(value)}</strong><span>{label}</span></div>)}</div>
            <div className="calculator-agee-progress-heading"><span>{t.progress}</span><strong>{number(Number(result.yearProgress.toFixed(1)))}%</strong></div>
            <div className="calculator-agee-progress" role="progressbar" aria-valuenow={result.yearProgress} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${result.yearProgress}%`}}/></div>
          </div>
          <div className="calculator-agee-dates"><p><span>{t.birthDate}</span><strong>{formatDate(birthDate!)}</strong></p><p><span>{t.calcDate}</span><strong>{formatDate(calculationDate!)}</strong></p></div>
          <div className="calculator-agee-actions">
            <button type="button" onClick={copyResult}>{t.copy}</button>
            <button type="button" onClick={shareResult}>{t.share}</button>
            <button type="button" onClick={()=>window.print()}>{t.print}</button>
            <button type="button" className="calculator-agee-reset" onClick={reset}>{t.reset}</button>
          </div>
          {message&&<p className="calculator-agee-message" role="status">{message}</p>}
        </div>}
      </section>
    </div>
    <section className="calculator-agee-article">
      <h1>{t.h1}</h1><p>{t.intro}</p>
      <h2>{t.h2a}</h2><p>{t.pa}</p>
      <h2>{t.h2b}</h2><p>{t.pb}</p>
      <h2>{t.h2c}</h2><p>{t.pc}</p>
      <h2>{t.faqTitle}</h2>
      <div className="calculator-agee-faq">{esAgeCalculatorFaqs.map((faq,index)=><div className="calculator-agee-faq-item" key={faq.question}>
        <button type="button" className="calculator-agee-faq-question" aria-expanded={openFaq===index} onClick={()=>setOpenFaq(openFaq===index?null:index)}>
          <span>{faq.question}</span><span aria-hidden="true">{openFaq===index?"−":"+"}</span>
        </button>
        {openFaq===index&&<div className="calculator-agee-faq-answer"><p>{faq.answer}</p></div>}
      </div>)}</div>
      <p className="calculator-agee-disclaimer">{t.note}</p>
    </section>
  </div>;
}
