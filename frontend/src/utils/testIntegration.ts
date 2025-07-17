import { chatAPI } from '../services/api'

export const testBackendIntegration = async () => {
  try {
    console.log('🧪 Testing Backend Integration...')

    // Test 1: Check capabilities
    console.log('1. Testing capabilities endpoint...')
    const capabilities = await chatAPI.getCapabilities()
    console.log('✅ Capabilities:', capabilities)

    // Test 2: Test chat endpoint
    console.log('2. Testing chat endpoint...')
    const chatResponse = await chatAPI.sendMessage(
      'Hello, this is a test message'
    )
    console.log('✅ Chat Response:', chatResponse)

    // Test 3: Test service endpoint
    console.log('3. Testing service endpoint...')
    const serviceTest = await chatAPI.testService()
    console.log('✅ Service Test:', serviceTest)

    console.log('🎉 All backend integration tests passed!')
    return true
  } catch (error) {
    console.error('❌ Backend integration test failed:', error)
    return false
  }
}

export const logBackendStatus = async () => {
  try {
    const capabilities = await chatAPI.getCapabilities()
    console.log('🔗 Backend Status:', {
      configured: capabilities.configured,
      model: capabilities.model,
      status: capabilities.status,
      features: capabilities.features,
    })
  } catch (error) {
    console.error('❌ Failed to get backend status:', error)
  }
}
