import React from 'react';
import { Table, Button, Input, List } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import './assets/css/index.scss'
import ListItem from "antd/es/upload/UploadList/ListItem";

  const data = []
  class App extends React.Component {

    state = {
      loading: false,
      uploadStatus: 'ready',
      title: '',
      files: [],
      uploads: [],
    };

    handleFileChange = (e) => {
      const { uploads, uploadStatus } = this.state;
      const file = e.target.files;
      if(file) {
        const uploadFile = file[0];
        const formData = new FormData();
        const fileObj = {
          id: uuidv4(),
          size: uploadFile.size,
          name: uploadFile.name,
          status: uploadStatus,
          raw: uploadFile,
          url: '',
        };
        formData.append('title', this.state.value);
        formData.append('name', uploadFile);
        this.setState({
          loading: true,
        });
        axios.post('http://www.misswho.cn:8100', formData,  {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          fileObj.status = 'success';
          fileObj.url = resp.data.fileUrl[0];
          this.setState({
            loading: false,
            uploads,
          });
        }).catch(err => {
          fileObj.status = 'error';
          fileObj.url = '';
          this.setState({
            loading: false,
            uploads,
          });
        }).finally(() => {
          // 解决同个文件不能重复上传问题
          this.myTextInput.value = '';
        })
        uploads.push(fileObj);
      }
    };

    onClick = () => {
      this.myTextInput.click();
    }

    handleTitle = (e) => {
      this.setState({
        title: e.target.value,
      });
    }

    render() {
      const { files, uploads } = this.state;
      return (
        <div style={{ width: '200px', margin: '200px auto' }}>
          <input multiple  ref={(ref) => this.myTextInput = ref} type='file' style={{ display: 'none'}} onChange={this.handleFileChange} />
          <Input value={this.state.title} onChange={this.handleTitle} />
          <Button loading={this.state.loading} onClick={this.onClick}>上传文件</Button>
          <List>
            {
              (uploads || []).map(item => <List.Item>
                <img style={{width: '50px', height: '50px', display: "block"}} src={item.url} />
                <span>{item.name}</span>
              </List.Item>)
            }
          </List>
        </div>
      );
    }
  }
export default App;
