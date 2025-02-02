# CAD.io

An AI-powered CAD platform enabling natural language 3D modeling, built with Next.js, OpenCascade.js, and Three.js.

## Features

- Natural language CAD modeling
- Real-time 3D viewport
- Integrated chat interface
- Boolean operations support
- Selection and modification tools
- Shape generation system

## Tech Stack

- **Frontend Framework**: Next.js with TypeScript
- **3D Engine**: Three.js
- **CAD Kernel**: OpenCascade.js
- **UI Components**: Tailwind CSS
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/
│   ├── studio/
│   │   └── CascadeStudio.tsx    # Main CAD viewport component
│   └── viewport/
│       └── Viewport3D.tsx       # Three.js viewport
├── lib/
│   ├── ai/
│   │   └── commandProcessor.ts  # Natural language processing
│   └── opencascade/
│       ├── init.ts             # OpenCascade initialization
│       └── shapes.ts           # Shape generation system
├── pages/
│   └── index.tsx               # Main application page
└── styles/
    └── globals.css             # Global styles
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser with WebGL support

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cad.io.git
cd cad.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Type natural language commands in the chat interface:
   - "Create a box 10x20x30"
   - "Add a cylinder with radius 5"
   - "Round these edges"

2. Use the 3D viewport to:
   - Rotate the view (left mouse button)
   - Pan (middle mouse button)
   - Zoom (mouse wheel)
   - Select objects (click)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenCascade.js for the CAD kernel
- Three.js for 3D visualization
- Next.js team for the amazing framework 