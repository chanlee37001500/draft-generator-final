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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    setError("");
    setOutputText("");

    const values = Object.values(form);
    if (values.some((v) => v.trim() === "")) {
      setError("모든 항목을 빠짐없이 입력해주세요.");
      return;
    }

    const { 날짜, 과정명, 행사명, 요청사항, 비목, 예산한도, 업체, 비용, 담당자 } = form;
    const 비용_clean = 비용.replace(/,/g, "").replace("원", "").trim();
    if (비용_clean && isNaN(비용_clean)) {
      setError("비용은 숫자 형식이어야 합니다. 쉼표 또는 '원' 제거 후 숫자로만 입력해주세요.");
      return;
    }
    const 비용_formatted = 비용_clean ? Number(비용_clean).toLocaleString() : "";

    const draft = `${과정명} ${행사명} 진행을 위한 차량임차\n\n\n연수운영부-   호(202 .  .  .) 요청에 의거 ${과정명} ${행사명} 진행을 위한 차량을 다음과 같이 임차하고자 합니다.\n\n1. 임차내역 : ${요청사항}\n\n2. 임차일정 : ${날짜}\n  - 상세내역 [붙임] 참조\n\n3. 소요예산 : ￦${비용_formatted}.- (부가세 포함)\n\n4. 처리비목 : ${비목}\n\n5. 계 약 처 : (주)${업체}\n\n6. 계약방법 : 수의계약 (계약규정 제41조 제1항 제1호에 의거)\n\n7. 기    타\n   가. 계약규정 제4조 제1항 제1호에 의거 계약서 작성을 생략하고 이행각서를 징구하고자 함\n   나. 본 품의로 지출결의에 갈음하고자 함\n\n\n붙       임 : 1. 견적서 각 1부,\n            2. 이행각서(안) 1부,\n            3. 관련 공문 1부, 끝.`;

    setOutputText(draft);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "기안서.txt";
    link.click();
  };

  return (
    <div>
      <h1>차량 임차 요청</h1>
      <p>연수 또는 행사를 위해 외부 차량임차가 필요하신 경우,<br />
        아래 <strong>[신청자 입력]</strong>란에 요청 정보를 입력해주세요
      </p>

      {/* 신청자 입력 영역 */}
      <div style={{
        backgroundColor: "#f4f8ff",
        border: "1px solid #c2d3eb",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem"
      }}>
        <h2>[신청자 입력]</h2>
        <p style={{ marginTop: "-0.5rem", marginBottom: "1rem", fontSize: "0.95rem", color: "#555" }}>
          임차를 신청하시는 분이 작성해주세요
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem"
        }}>
          {["날짜", "과정명", "행사명", "요청사항", "비목", "예산한도"].map((key) => (
            <div key={key}>
