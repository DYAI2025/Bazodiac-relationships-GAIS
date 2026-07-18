/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Redirect to the standalone click dummy landing page
    window.location.replace('/prototype/landing/index.html');
  }, []);

  return (
    <div style={{
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      backgroundColor: '#fbf7ee',
      color: '#3c352a',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '2.25rem', fontWeight: 300 }}>Bazodiac Relationships</h1>
      <p style={{ color: '#827565', fontSize: '1rem', fontStyle: 'italic' }}>Loading the interactive landing page and click dummy prototype...</p>
    </div>
  );
}

