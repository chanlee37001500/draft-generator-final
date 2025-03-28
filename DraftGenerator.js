import React, { useState } from "react";

export default function DraftGenerator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setError("");
    setOutputText("");

    const parts = inputText.split("\t").map((p) => p.trim());
    if (parts.length !== 8) {
      setError(
        "입력값이 8개가 아닙니다.\n날짜, 과정명, 행사명, 요청사항, 비목, 업체, 비용, 담당자 순으로 입력했는지 확인해주세요."
      );
      return;
    }

    const [날짜, 과정명, 행사명, 요청사항, 비목, 업체, 비용, 담당자] = parts;
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
      <h1>자동 기안서 생성기</h1>
      <p>아래 칸에 8개 항목을 탭(간격)으로 구분해 붙여넣어 주세요<br />날짜, 과정명, 행사명, 요청사항, 비목, 업체, 비용, 담당자</p>
      <textarea
        style={{ width: "100%", height: "100px" }}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleGenerate}>기안서 작성</button>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {outputText && (
        <div>
          <h2>기안서 미리보기</h2>
          <textarea readOnly style={{ width: "100%", height: "300px" }} value={outputText} />
          <button onClick={handleDownload}>텍스트 파일 다운로드</button>
        </div>
      )}
    </div>
  );
}
