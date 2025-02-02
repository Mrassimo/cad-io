import React, { useEffect, useRef, useState } from 'react'
import { initializeOpenCascade } from '@/lib/opencascade/init'
import { ShapeGenerator, ShapeParams } from '@/lib/opencascade/shapes'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface CascadeStudioProps {
  onSelectionChange?: (selection: any) => void
  onOperationComplete?: (result: any) => void
}

export const CascadeStudio: React.FC<CascadeStudioProps> = ({
  onSelectionChange,
  onOperationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.PerspectiveCamera(75, 1, 0.1, 1000))
  const [renderer] = useState(() => new THREE.WebGLRenderer({ antialias: true }))
  const [controls, setControls] = useState<OrbitControls | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize OpenCascade
    initializeOpenCascade().catch(console.error)

    // Setup Three.js scene
    scene.background = new THREE.Color(0xf0f0f0)
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Setup controls
    const newControls = new OrbitControls(camera, renderer.domElement)
    setControls(newControls)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      newControls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      newControls.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [camera, renderer])

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
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
      }}
    />
  )
}

export default CascadeStudio 