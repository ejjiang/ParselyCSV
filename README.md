# 📊 CSV Uploader

A beautiful, modern TypeScript application that allows you to upload and view CSV files through an intuitive web interface.

![CSV Uploader](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## ✨ Features

- 🎨 **Modern UI** - Beautiful, responsive design with gradient backgrounds
- 📁 **Drag & Drop** - Intuitive file upload with drag-and-drop support
- 📊 **Real-time Preview** - Instant CSV parsing and data visualization
- 📱 **Mobile Friendly** - Responsive design that works on all devices
- ⚡ **Fast Processing** - Quick file upload and parsing with automatic cleanup
- 🔍 **Data Preview** - View first 100 rows with full column headers
- 📈 **File Info** - Display row count, column count, and file size

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ejjiang/ParselyCSV.git
   cd ParselyCSV
   ```
   
   Or download the ZIP from [GitHub](https://github.com/ejjiang/ParselyCSV)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🛠️ Development

For development with auto-reload:

```bash
npm run dev
```

This will start the server with `ts-node` for faster development cycles.

## 📖 Usage

1. **Open the application** in your browser at `http://localhost:3000`
2. **Upload a CSV file** by either:
   - Dragging and dropping a CSV file onto the upload area
   - Clicking the upload area to browse for a file
3. **Click "Upload File"** to process the CSV
4. **View the results** in the beautiful table below
5. **Use "Clear Results"** to upload a new file

## 🏗️ Project Structure

```
csv-uploader/
├── src/
│   └── server.ts          # Express server with CSV processing
├── public/
│   └── index.html         # Frontend HTML with modern UI
├── uploads/               # Temporary file storage (auto-created)
├── dist/                  # Compiled JavaScript (auto-created)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🔧 API Endpoints

- `GET /` - Serves the main HTML page
- `POST /upload` - Uploads and processes a CSV file

### Upload Response Format

```json
{
  "message": "File uploaded and parsed successfully",
  "data": [
    {
      "column1": "value1",
      "column2": "value2"
    }
  ],
  "rowCount": 100
}
```

## 🛡️ File Validation

- Only `.csv` files are accepted
- Files are automatically validated on upload
- Temporary files are cleaned up after processing
- Maximum file size handling (configurable)

## 🎨 UI Features

- **Gradient Background** - Beautiful purple gradient design
- **Hover Effects** - Interactive elements with smooth transitions
- **Loading States** - Spinner and progress indicators
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Clear confirmation of successful uploads
- **Responsive Table** - Scrollable table with sticky headers

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Multer** - File upload handling
- **csv-parser** - CSV file parsing

### Frontend
- **Vanilla HTML/CSS/JavaScript** - No framework dependencies
- **Modern CSS** - Flexbox, Grid, and CSS animations
- **Responsive Design** - Mobile-first approach

## 📝 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run watch` - Watch for TypeScript changes and recompile

## 🔒 Security Features

- File type validation (CSV only)
- Temporary file cleanup
- Error handling for malformed files
- No persistent file storage

## 🚀 Deployment

The application is ready for deployment to any Node.js hosting service:

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Set environment variables if needed (PORT, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Server won't start:**
- Make sure you're in the correct directory (`csv-uploader/`)
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript

**File upload fails:**
- Ensure the file is a valid CSV format
- Check file size (should be reasonable)
- Verify the server is running on port 3000

**Port already in use:**
- Change the PORT environment variable
- Or kill the process using port 3000

## 🎯 Future Enhancements

- [ ] Export processed data to different formats
- [ ] Data filtering and sorting
- [ ] Chart visualization
- [ ] Multiple file upload
- [ ] Data validation rules
- [ ] User authentication
- [ ] Database integration

---

**Made with ❤️ using TypeScript and Express.js**