import React, { useState } from "react";

export default function DraftGenerator() {
  const [form, setForm] = useState({
    과정명: "",
    행사명: "",
    요청사항: "",
    비목: "",
    예산한도: "",
    업체: "",
    비용: "",
    담당자: "",
  });

  const [dateMode, setDateMode] = useState("range"); // 'range' or 'multi'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [multiDates, setMultiDates] = useState([]);

  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [savedDate, setSavedDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "multi") {
      if (/^\d{4}$/.test(value)) {
        setMultiDates((prev) => [...prev, value]);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 날짜 변환 함수
  const getWeekday = (mmdd) => {
    if (!/^\d{4}$/.test(mmdd)) return '';
    const year = new Date().getFullYear();
    const month = parseInt(mmdd.slice(0, 2)) - 1;
    const day = parseInt(mmdd.slice(2, 4));
    const date = new Date(year, month, day);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${mmdd.slice(0, 2)}/${mmdd.slice(2, 4)}(${weekdays[date.getDay()]})`;
  };

  const formatDateRange = (start, end) => `${getWeekday(start)}에서 ${getWeekday(end)}까지`;
  const formatMultipleDates = (arr) => arr.map(getWeekday).join(', ');

  const getFormattedDate = () => {
    if (dateMode === "range") {
      return formatDateRange(startDate, endDate);
    } else {
      return formatMultipleDates(multiDates);
    }
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

    if (dateMode === "range" && (!/^\d{4}$/.test(startDate) || !/^\d{4}$/.test(endDate))) {
      setError("시작일과 종료일은 4자리 숫자(MMDD)로 입력해주세요.");
      return;
    }

    if (dateMode === "multi" && multiDates.length === 0) {
      setError("특정 일자를 하나 이상 입력해주세요.");
      return;
    }

    const { 과정명, 행사명, 요청사항, 비목, 예산한도, 업체, 비용, 담당자 } = form;
    const 날짜 = getFormattedDate();

    const 비용_clean = 비용.replace(/,/g, "").replace("원", "").trim();
    if (비용_clean && isNaN(비용_clean)) {
      setError("비용은 숫자 형식이어야 합니다.");
      return;
    }
    const 비용_formatted = 비용_clean ? Number(비용_clean).toLocaleString() : "";

    const draft = `${과정명} ${행사명} 진행을 위한 차량임차\n\n\n연수운영부-   호(202 .  .  .) 요청에 의거 ${과정명} ${행사명} 진행을 위한 차량을 다음과 같이 임차하고자 합니다.\n\n1. 임차내역 : ${요청사항}\n\n2. 임차일정 : ${날짜}\n  - 상세내역 [붙임] 참조\n\n3. 소요예산 : ￦${비용_formatted}.- (부가세 포함)\n\n4. 처리비목 : ${비목}\n\n5. 계 약 처 : (주)${업체}\n\n6. 계약방법 : 수의계약 (계약규정 제41조 제1항 제1호에 의거)\n\n7. 기    타\n   가. 계약규정 제4조 제1항 제1호에 의거 계약서 작성을 생략하고 이행각서를 징구하고자 함\n   나. 본 품의로 지출결의에 갈음하고자 함\n\n\n붙       임 : 1. 견적서 각 1부,\n            2. 이행각서(안) 1부,\n            3. 관련 공문 1부, 끝.`;

    setOutputText(draft);
    setSavedDate(formatToday());
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
      <p>아래 항목을 한 줄에 입력해주세요. 날짜는 입력 방식 선택 후 4자리 숫자로 입력합니다.</p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "flex-end",
        background: "#f9f9f9",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}>
        {/* 날짜 방식 선택 */}
        <div>
          <label><strong>날짜 입력 방식</strong><br />
            <select value={dateMode} onChange={(e) => setDateMode(e.target.value)}>
              <option value="range">범위로 지정</option>
              <option value="multi">특정 일자(들) 선택</option>
            </select>
          </label>
        </div>

        {dateMode === "range" ? (
          <>
            <div>
              <label><strong>시작일</strong><br />
                <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="예: 0403" />
              </label>
            </div>
            <div>
              <label><strong>종료일</strong><br />
                <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="예: 0405" />
              </label>
            </div>
          </>
        ) : (
          <div>
            <label><strong>일자</strong><br />
              <input type="text" name="multi" onChange={handleChange} placeholder="예: 0403" />
              <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                선택됨: {formatMultipleDates(multiDates)}
              </div>
            </label>
          </div>
        )}

        {/* 기타 항목 입력 */}
        {["과정명", "행사명", "요청사항", "비목", "예산한도", "업체", "비용", "담당자"].map((key) => (
          <div key={key}>
            <label><strong>{key}</strong><br />
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                style={{ minWidth: "120px" }}
              />
            </label>
          </div>
        ))}

        {/* 저장 + 저장일자 */}
        <div>
          <button onClick={handleSave} style={{ padding: "0.6rem 1.2rem" }}>저장</button>
          {savedDate && <div style={{ marginTop: "0.4rem", fontSize: "0.9rem" }}>저장일자: {savedDate}</div>}
        </div>
      </div>

      {error && <pre style={{ color: "red", marginTop: "1rem" }}>{error}</pre>}

      {outputText && (
        <div>
          <h2 style={{ marginTop: "2rem" }}>기안서 미리보기</h2>
          <textarea
            readOnly
            style={{ width: "100%", height: "300px" }}
            value={outputText}
          ></textarea>
          <button onClick={handleDownload}>텍스트 파일 다운로드</button>
        </div>
      )}
    </div>
  );
}
