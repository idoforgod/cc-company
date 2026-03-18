동의한다. 나는 이 phase들을 각각 별도의 claude session을 spawn해서 직렬로 개발하고싶다.  
이를 위해 다음과 같은 준비가 필요하다.

1. 먼저 `/tasks` 폴더를 만들고, 각 phase의 상세프롬프트/참조문서/AC/주의사항/추가관련내용을 담은 `phase{N}.md` 파일을 각각 생성한다. 같은  
   경로에 `index.json`도 생성하여, 현재 진행상태를 기록한다.
2. python script를 이용해 claude를 spawn한다. loop로 index.json을 읽고 다음 phase에 대해 claude cli를 호출한다. output은 `phase{N}.md`와  
   같은 경로에 `phase{N}-output.json`으로 저장한다. 이떄 `phase{N}.md`파일을 읽으라고 프롬프트에 작성하는 대신, 해당 파일 내용 자체가  
   프롬프트에 그대로 작성되도록 한다. index.json을 잘 업데이트하라는 내용이 포함되어야한다. AC 통과에 실패한 경우, index.json에 해당 phase를
   error로 표시하게한다. loop에서 마지막 phase가 error인 경우 탈출하고 사용자에게 메세지를 노출한다.

피드백을 부탁한다.
