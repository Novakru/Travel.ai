import React, { useState } from 'react';
import '../../styles/loginForm.css'; 

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true); // true 表示密码隐藏，false 表示密码可见
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const switchForm = (formType: 'login' | 'register') => {
    if (formType === 'login') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  const togglePasswordVisibility = (passwordId: 'loginPassword' | 'registerPassword') => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert('请输入您的邮箱和密码');
      return;
    }

    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('登录成功');
        } else {
          alert('登录失败，请检查您的邮箱和密码');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('登录过程中发生错误');
      });
  };

  const registerAndReturn = () => {
    if (!registerEmail || !registerPassword) {
      alert('请输入您的邮箱和密码');
      return;
    }

    alert('注册成功！请登录。'); // 示例提示信息
    switchForm('login'); // 切换回登录表单
  };

  return (
    <div className="container">
      <h2 id="formTitle">{isLogin ? '登录' : '注册'}</h2>
      {isLogin ? (
        <div id="loginForm">
          <div className="form-group">
            <label htmlFor="loginEmail">电子邮箱地址或电话号码</label>
            <input 
              type="text" 
              id="loginEmail" 
              placeholder="请输入您的邮箱或电话号码" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">密码</label>
            <input 
              type={passwordVisibility ? 'password' : 'text'}
              id="loginPassword" 
              placeholder="请输入您的密码"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {passwordVisibility ? (
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('loginPassword')}
              >
                &#128065;
              </span>
            ) : (
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('loginPassword')}
              >
                &#128064;
              </span>
            )}
          </div>
          <button 
            className="button" 
            onClick={handleLogin}
          >
            登录
          </button>
        </div>
      ) : (
        <div id="registerForm">
          <div className="form-group">
            <label htmlFor="registerEmail">电子邮箱地址或电话号码</label>
            <input 
              type="text" 
              id="registerEmail" 
              placeholder="请输入您的邮箱或电话号码" 
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerPassword">密码</label>
            <input 
              type={passwordVisibility ? 'password' : 'text'}
              id="registerPassword" 
              placeholder="请输入您的密码"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            {passwordVisibility ? (
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('registerPassword')}
              >
                &#128065;
              </span>
            ) : (
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('registerPassword')}
              >
                &#128064;
              </span>
            )}
          </div>
          <button className="button" onClick={registerAndReturn}>
            注册
          </button>
        </div>
      )}
      <div 
        className="toggle-button" 
        onClick={toggleForm}
      >
        {isLogin ? '没有账号？立即注册' : '已有账号？去登录'}
      </div>
    </div>
  );
};

export default LoginForm;
