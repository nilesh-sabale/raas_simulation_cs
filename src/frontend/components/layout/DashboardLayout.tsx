import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
`

const MatrixBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 204, 106, 0.02) 0%, transparent 50%);
  z-index: -1;
  /* Removed animation for better performance */
`

const MainContent = styled.main<{ sidebarCollapsed: boolean }>`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '60px' : 'var(--sidebar-width)'};
  min-height: 100vh;
  background: var(--bg-primary);
  transition: var(--transition-normal);
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ContentArea = styled.div`
  padding-top: var(--header-height);
  min-height: 100vh;
`

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <LayoutContainer>
      <MatrixBackground />

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={toggleSidebar}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Header
          onMenuToggle={toggleMobileMenu}
          onSidebarToggle={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

export default DashboardLayout