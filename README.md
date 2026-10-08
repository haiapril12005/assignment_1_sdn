# SimpleQuiz REST API - Assignment 1 (SDN302)

Dự án Backend quản lý **Quiz** và **Questions** cho ứng dụng kiểm tra kiến thức trực tuyến, được xây dựng theo kiến trúc chuẩn **MVC**, sử dụng **Node.js**, **Express**, **MongoDB** và **Mongoose**.

---

## 📁 1. Cấu Trúc Dự Án (Mô hình MVC)

```
Ass1_sdn/
├── bin/
│   └── www                     # Entry point khởi tạo HTTP server
├── controllers/
│   ├── questionController.js   # Logic nghiệp vụ xử lý Questions
│   └── quizController.js       # Logic nghiệp vụ xử lý Quizzes
├── models/
│   ├── question.js             # Mongoose Model & Schema cho Question
│   └── quiz.js                 # Mongoose Model & Schema cho Quiz
├── routes/
│   ├── questionRouter.js       # Express Router module cho /question và /questions
│   └── quizRouter.js           # Express Router module cho /quizzes
├── utils/
│   └── handleError.js          # Helper bắt lỗi Mongoose (ValidationError, CastError)
├── public/
│   └── index.html              # Web UI Dashboard trực quan kiểm thử API
├── postman/
│   └── SimpleQuiz_Postman_Collection.json # File collection import vào Postman
├── .env                        # File cấu hình biến môi trường
├── .env.example                # File mẫu biến môi trường
├── app.js                      # Cấu hình Express app, kết nối MongoDB & middleware
├── package.json                # Khai báo dependencies và scripts
├── README.md                   # Tài liệu hướng dẫn chi tiết
└── test_api.js                 # Script kiểm thử tự động toàn bộ API
```

---

## ⚙️ 2. Yêu Cầu và Cài Đặt

### Cài đặt thư viện:
Mở terminal tại thư mục `Ass1_sdn` và chạy lệnh:
```bash
npm install
```

### Cấu hình môi trường (.env):
File `.env` mặc định kết nối tới MongoDB local cơ sở dữ liệu `SimpleQuiz`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/SimpleQuiz
MONGODB_URL=mongodb://127.0.0.1:27017/SimpleQuiz
MONGODB_URI=mongodb://127.0.0.1:27017/SimpleQuiz
DEBUG=ass1-sdn:*
```
> **Lưu ý**: Hãy đảm bảo MongoDB service (cổng `27017`) đang chạy trên máy của bạn.

---

## 🚀 3. Các Lệnh Thực Thi

| Lệnh | Chức năng |
| :--- | :--- |
| `npm start` | Chạy server thông qua `./bin/www` tại cổng 3000 |
| `npm run dev` | Chạy server với `nodemon` (tự động reload khi sửa code) |
| `npm test` | Chạy bộ kiểm thử tự động toàn diện qua file `test_api.js` |

Khi server đang chạy, bạn có thể truy cập trình duyệt tại:
- **Web UI Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Kiểm tra trạng thái server**: [http://localhost:3000/api/status](http://localhost:3000/api/status)

---

## 📑 4. Chi Tiết Thực Hiện Các Yêu Cầu Đề Bài

### 1. Schema & Mongoose Model

#### Model Quiz (`models/quiz.js`):
- `_id`: ObjectId tự động sinh bởi MongoDB / Mongoose.
- `title`: `String`, bắt buộc (`required`), tự động cắt khoảng trắng (`trim: true`).
- `description`: `String`, mô tả cho quiz.
- `questions`: Mảng chứa các ObjectId tham chiếu đến Question (`[{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]`).

#### Model Question (`models/question.js`):
- `_id`: ObjectId tự động sinh.
- `text`: `String`, bắt buộc, nội dung câu hỏi.
- `options`: Mảng `[String]`, bắt buộc tối thiểu 2 lựa chọn.
- `keywords`: Mảng `[String]` các từ khóa liên quan.
- `correctAnswerIndex`: `Number`, chỉ số index của đáp án đúng trong mảng `options` (chỉ số hợp lệ `>= 0` và `< options.length`).

---

### 2. Danh Sách Các Endpoints REST API

#### A. Nhóm Quizzes API (`/quizzes`):
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/quizzes` | Lấy danh sách tất cả quizzes (**dùng populate('questions')** để hiển thị trọn vẹn thông tin các câu hỏi) |
| **POST** | `/quizzes` | Tạo mới một hoặc nhiều bài quiz. Trả về text: `Added the quiz with id: <id>` |
| **GET** | `/quizzes/:quizId` | Xem thông tin chi tiết một quiz theo ID (đã populate questions) |
| **PUT** | `/quizzes/:quizId` | Cập nhật thông tin quiz |
| **DELETE** | `/quizzes/:quizId` | Xóa quiz theo ID |
| **GET** | `/quizzes/:quizId/populate` | **(Yêu cầu 3)** Lọc các câu hỏi trong quiz có chứa từ khóa **"capital"** |
| **POST** | `/quizzes/:quizId/question` | **(Yêu cầu 4)** Tạo 1 câu hỏi mới và tự động gán vào quiz |
| **POST** | `/quizzes/:quizId/questions` | **(Yêu cầu 5)** Tạo nhiều câu hỏi mới cùng lúc và gán vào quiz |

#### B. Nhóm Question API (`/question` & `/questions`):
> *Hệ thống hỗ trợ song song cả `/question` (theo đề bài) và `/questions` (chuẩn REST)*

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/questions` hoặc `/question` | Lấy danh sách tất cả câu hỏi |
| **POST** | `/questions` hoặc `/question` | Tạo mới một câu hỏi độc lập |
| **GET** | `/questions/:questionId` | Xem chi tiết một câu hỏi theo ID |
| **PUT** | `/questions/:questionId` | Cập nhật nội dung câu hỏi theo ID |
| **DELETE** | `/questions/:questionId` | Xóa câu hỏi theo ID (đồng thời tự gỡ ID khỏi các quiz chứa nó) |

---

## 🧪 5. Dữ Liệu Mẫu Kiểm Thử (Sample Payloads)

### 1. Tạo câu hỏi mới (`POST /questions`):
```json
{
  "text": "What is the capital of Vietnam?",
  "options": ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue"],
  "keywords": ["capital", "vietnam"],
  "correctAnswerIndex": 0
}
```

### 2. Tạo Quiz mới (`POST /quizzes`):
```json
{
  "title": "Science Quiz",
  "description": "Test your knowledge of scientific concepts!"
}
```

### 3. Thêm 1 câu hỏi vào Quiz (`POST /quizzes/:quizId/question`):
```json
{
  "text": "What is the capital of France?",
  "options": ["Paris", "London", "Berlin", "Madrid"],
  "keywords": ["capital", "europe"],
  "correctAnswerIndex": 0
}
```

### 4. Thêm nhiều câu hỏi vào Quiz (`POST /quizzes/:quizId/questions`):
```json
[
  {
    "text": "What is the capital of Germany?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "keywords": ["capital", "germany"],
    "correctAnswerIndex": 2
  },
  {
    "text": "Which is the largest ocean?",
    "options": ["Atlantic", "Pacific", "Indian", "Arctic"],
    "keywords": ["ocean", "geography"],
    "correctAnswerIndex": 1
  }
]
```

### 5. Lọc câu hỏi có từ "capital" (`GET /quizzes/:quizId/populate`):
Chỉ trả về các câu hỏi có trường `text` hoặc `keywords` chứa từ khóa "capital".

---

## 📬 6. Kiểm Thử Với Postman
1. Mở Postman -> Chọn **Import**.
2. Chọn file [SimpleQuiz_Postman_Collection.json](file:///d:/FPTuSubject/Term%207/SDN302/codeSDN/Ass1_sdn/postman/SimpleQuiz_Postman_Collection.json).
3. Đặt biến môi trường `baseUrl` là `http://localhost:3000`.
4. Có thể thực hiện lần lượt các request đã được cấu hình sẵn.
