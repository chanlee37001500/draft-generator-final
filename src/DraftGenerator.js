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
  const [savedDate, setSavedDate] = useState(null);

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

    const { 날짜, 과정명, 행사명, 요청사항, 비목, 예산한도, 업체, 비용, 담당자 } = form;
    const formattedDate = formatDateString(날짜);
    if (!formattedDate) {
      setError("날짜는 8자리 숫자 (예: 20250401) 형식으로 입력해주세요.");
      return;
    }

    const 비용_clean = 비용.replace(/,/g, "").replace("원", "").trim();
    if (비용_clean && isNaN(비용_clean)) {
      setError("비용은 숫자 형식이어야 합니다.");
      return;
    }

    const 비용_formatted = 비용_clean ? Number(비용_clean).toLocaleString() : "";

    const draft = `${과정명} ${행사명} 진행을 위한 차량임차\n\n\n연수운영부-   호(202 .  .  .) 요청에 의거 ${과정명} ${행사명} 진행을 위한 차량을 다음과 같이 임차하고자 합니다.\n\n1. 임차내역 : ${요청사항}\n\n2. 임차일정 : ${formattedDate}\n  - 상세내역 [붙임] 참조\n\n3. 소요예산 : ￦${비용_formatted}.- (부가세 포함)\n\n4. 처리비목 : ${비목}\n\n5. 계 약 처 : (주)${업체}\n\n6. 계약방법 : 수의계약 (계약규정 제41조 제1항 제1호에 의거)\n\n7. 기    타\n   가. 계약규정 제4조 제1항 제1호에 의거 계약서 작성을 생략하고 이행각서를 징구하고자 함\n   나. 본 품의로 지출결의에 갈음하고자 함\n\n\n붙       임 : 1. 견적서 각 1부,\n            2. 이행각서(안) 1부,\n            3. 관련 공문 1부, 끝.`;

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
      <p>
        연수 또는 행사를 위해 외부 차량임차가 필요하신 경우,<br />
        아래 <strong>[신청자 입력]</strong>란에 요청 정보를 입력해주세요
      </p>

      {/* 가로 한 줄 정렬: 신청자입력 | 총무팀입력 | 저장 */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        marginTop: "1.5rem",
        gap: "1.5rem"
      }}>
        {/* 신청자 입력 */}
        <div style={{
          backgroundColor: "#f4f8ff",
          border: "1px solid #c2d3eb",
          borderRadius: "8px",
          padding: "1rem",
          width: "280px"
        }}>
          <h2>[신청자 입력]</h2>
          {["날짜", "과정명", "행사명", "요청사항", "비목", "예산한도"].map((key) => (
            <div key={key} style={{ marginBottom: "0.8rem" }}>
              <label>
                <strong>{key}</strong><br />
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key === "날짜" ? "예: 20250401" : ""}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
              </label>
            </div>
          ))}
        </div>

        {/* 총무팀 입력 */}
        <div style={{
          backgroundColor: "#fff9f2",
          border: "1px solid #e6cfa8",
          borderRadius: "8px",
          padding: "1rem",
          width: "280px"
        }}>
          <h2>[총무팀 입력]</h2>
          {["업체", "비용", "담당자"].map((key) => (
            <div key={key} style={{ marginBottom: "0.8rem" }}>
              <label>
                <strong>{key}</strong><br />
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
              </label>
            </div>
          ))}
        </div>

        {/* 저장 버튼 + 날짜 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          paddingTop: "2rem"
        }}>
          <button onClick={handleSave} style={{ padding: "0.8rem 1.5rem" }}>저장</button>
          {savedDate && (
            <div style={{ fontSize: "0.9rem", color: "#555" }}>
              저장일자: {savedDate}
            </div>
          )}
        </div>
      </div>

      {/* 오류 메시지 */}
      {error && <pre style={{ color: "red", marginTop: "1rem" }}>{error}</pre>}

      {/* 출력 결과 */}
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
