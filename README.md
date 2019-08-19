# graphQL-React-BookingApp
![LockerImg](https://user-images.githubusercontent.com/10339017/58608209-827b1b00-82dd-11e9-88c7-0b47bab07c63.PNG)
<center>See a [<a href="https://github.com/skqoaudgh/Web-graphQL-React-BookingEvent">source of this project</a>] hosted on GitHub.</center>


## Summary
* 이 프로젝트는 개인 프로젝트입니다.
* 웹을 통해 이벤트(행사)를 등록하고 다른 사용자가 예약할 수 있도록 합니다.
     

## Tech Stack
* React.js
* Node.js
* GrahpQL
* MongoDB (NoSQL)


## Path Routing Page
* /auth - 회원가입 및 로그인
* /events: 이벤트 등록 및 확인
* /bookings: 예약된 이벤트 확인


## Feature
* 제목, 가격, 시간, 설명을 작성하여 이벤트를 등록할 수 있습니다.
* 등록된 이벤트를 예약할 수 있고, 예약한 이벤트에 대한 통계를 그래프로 확인할 수 있습니다.
* 계정을 등록할 수 있고 로그아웃 전 까지 계속 로그인이 유지됩니다.


## I learn this
* React.js Context API를 이용한 상태관리
* GraphQL을 이용한 Endpoint 설계 및 구현 방법
* JWT의 토큰 방식의 계정 시스템 (계정생성, 로그인)


## Screenshots
![LockerImg](https://user-images.githubusercontent.com/10339017/58616567-eced8480-82f8-11e9-84f5-f709b9338f6c.jpg)


## Reference
[Academind GraphQL, Node.js, MongoDB and React.js Tutorial (Youtube)](https://www.youtube.com/watch?v=7giZGFDGnkc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_)
* 이 튜토리얼을 참고하여 프로젝트를 진행하였으며 아래의 사항을 새롭게 추가하여 개발하였습니다.
  1. 회원가입, 로그인 등 알림 메시지에 대한 모달 페이지
  2. localStorage를 이용하여 새로고침(F5)를 해도 로그인 유지
  3. 업로드한 이벤트의 수정
  4. 각 이벤트별 예약 인원의 저장 및 표기
  5. 이벤트의 리스트를 다시 불러올 수 있는 새로고침 기능
  6. DB Usage를 줄이기 위해 User 모델 스키마에 예약한 이벤트를 저장하는 필드 추가
  7. 이벤트를 중복으로 예약이 가능하던 오류 수정
  8. OpenSSL을 이용하여 로컬 HTTPS 서버 구축
