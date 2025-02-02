import React, { useEffect, useRef, useState } from 'react'
import { initializeOpenCascade } from '@/lib/opencascade/init'
import { ShapeGenerator, ShapeParams } from '@/lib/opencascade/shapes'
import dynamic from 'next/dynamic'

interface CascadeStudioProps {
  onSelectionChange?: (selection: any) => void
  onOperationComplete?: (result: any) => void
}

// Create a client-side only version of the component
const CascadeStudioClient: React.FC<CascadeStudioProps> = ({
  onSelectionChange,
  onOperationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)
  const sceneRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || initialized) return

    const initScene = async () => {
      try {
        // Dynamic imports to ensure client-side only execution
        const [THREE, { OrbitControls }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls')
        ])

        // Initialize Three.js
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
        })

        // Store scene reference for later use
        sceneRef.current = { scene, camera, renderer }

        // Setup scene
        scene.background = new THREE.Color(0xf0f0f0)
        camera.position.set(5, 5, 5)
        camera.lookAt(0, 0, 0)

        // Handle initial sizing
        const { width, height } = containerRef.current.getBoundingClientRect()
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        containerRef.current.appendChild(renderer.domElement)

        // Setup controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)

        // Add grid helper
        const gridHelper = new THREE.GridHelper(10, 10)
        scene.add(gridHelper)

        // Add axes helper
        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        // Initialize OpenCascade
        await initializeOpenCascade()
        console.log('Scene initialized successfully')

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return
          const { width, height } = containerRef.current.getBoundingClientRect()
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.setSize(width, height)
        }

        window.addEventListener('resize', handleResize)
        setInitialized(true)

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize)
          renderer.dispose()
          controls.dispose()
          if (containerRef.current?.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement)
          }
        }
      } catch (error) {
        console.error('Failed to initialize scene:', error)
      }
    }

    initScene()
  }, [initialized])

  // Execute CAD operation
  const executeOperation = async (operation: string, params: ShapeParams) => {
    try {
      const shape = await ShapeGenerator.executeOperation(operation, params)
      // Convert OpenCascade shape to Three.js geometry and add to scene
      // This is a placeholder - actual conversion logic needed
      onOperationComplete?.(shape)
    } catch (error) {
      console.error('Failed to execute operation:', error)
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 bg-gray-50"
      style={{ 
        touchAction: 'none', // Prevent touch scrolling/zooming
      }}
    />
  )
}

// Export a dynamic component that only renders on the client
export const CascadeStudio = dynamic(() => Promise.resolve(CascadeStudioClient), {
  ssr: false,
})

export default CascadeStudio 