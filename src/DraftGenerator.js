import React, { useState } from "react";

export default function DraftGenerator() {
  const [form, setForm] = useState({
    날짜: "",
    과정명: "",
    행사명: "",
    요청사항: "",
    비목: "",
    예산한도: "",
    업체: "",
    비용: "",
    담당자: "",
  });

  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [savedDate, setSavedDate] = useState(null); // 저장된 날짜

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateString = (raw) => {
    if (!/^\d{8}$/.test(raw)) return null;
    return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}.`;
  };

  const formatToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}.`;
  };

  const handleSave = () => {
    setError("");
    setOutputText("");

    const values = Object.values(form);
    if (values.some((v) => v.trim() === "")) {
      setError("모든 항목을 빠짐없이 입력해주세요.");
      return;
    }

    const { 날짜, 과정명, 행사명, 요청사항, 비목, 예산한도, 업체, 비용, 담당자 } = form
