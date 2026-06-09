# Quality of life improvement for the Typst web app.

Only one QoL improvement for now: make compiler error alert more clear. Currently, when you write on the Typst web app and make an error, the only indication of the error is a red squiggly line under where there's an error and a little indicator on the left sidebar on the Issues & Suggestions icon showing how many errors there are. The preview panel will simply freeze,  no changes. This extensions adds a clearer and a more straightforward warning located in the middle of the preview plane. 

More QoL improvements are planned, if I can think of more. Send your ideas on the Github repo page.

## Build Instructions

This extension is built using [WXT](https://wxt.dev/). To build the extension from source for submission or manual installation, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/contrapoetra/typst-qol-improvements.git
   cd typst-qol-improvements
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   - For **Chrome**: `npm run build`
   - For **Firefox**: `npm run build:firefox`
   - For **Safari**: `npx wxt build -b safari`

4. **Generate ZIP for submission:**
   - For **Chrome**: `npm run zip`
   - For **Firefox**: `npm run zip:firefox`

### Safari-specific Notes
Building for Safari requires a macOS machine with **Xcode** installed. After running the Safari build command, you can use the `safari-web-extension-converter` tool provided by Apple to create a Safari App Extension project:
```bash
xcrun safari-web-extension-converter .output/safari-mv3 --project-location .output/safari-project
```

The build output will be located in the `.output/` directory. For Firefox/AMO submissions, the ZIP file containing the compiled extension can be found at `.output/typst-qol-improvements-<version>-firefox.zip`.


