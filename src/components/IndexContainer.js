import { PropTypes } from 'prop-types';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import SidePublic from './SidePublic';
import SideSiwangyin from './SideSiwangyin';
import QueryUserTable from './user/QueryUserTable';
import QueryNavTable from './nav/QueryNavTable';
import AddUserForm from './user/AddUserForm';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class IndexContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:props.user,
      system:props.system || props.user.system,
      module:props.module || props.user.module,
      features:props.features,
      data:props.data
    }
  }
  componentWillReceiveProps(props) {
    this.setState({user:props.user, features:props.features, data:props.data, system:props.system, module:props.module});
  }
  chooseSystem(system, module){
    switch(system) {
      case 'public':
        return <SidePublic module={module} changeFeatures={(features) => {this.props.changeFeatures(features)}}/>;
      case 'siwangyin':
        return <SideSiwangyin module={module} changeFeatures={(features) => {this.props.changeFeatures(features)}}/>;
      case 'letspogo':
        return <SideLetspogo module={module} changeFeatures={(features) => {this.props.changeFeatures(features)}}/>;
      default:
        return '错误';
    }
  }
  chooseContent(features){
    switch(features) {
      case 'queryUser':
        return <QueryUserTable data={this.state.data} saveUser={(user) => {this.props.saveUser(user)}}/>;
      case 'addUser':
        return <AddUserForm addUser={(user) => {this.props.addUser(user)}}/>;
      case 'queryNav':
        return <QueryNavTable data={this.state.data} saveNav={(nav) => {this.props.saveNav(nav)}}/>;
      default:
        return "未选中功能，或该功能暂未开放!";
    }
  }
  render() {
    return <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[this.state.user.system]}
                style={{ lineHeight: '64px' }}
                onClick={(item) => {this.props.changeSystem(item.key)}}
              >
                <Menu.Item key="public">公共系统</Menu.Item>
                <Menu.Item key="siwangyin">黑光避难所</Menu.Item>
                <Menu.Item key="letspogo">Let's Pogo</Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Sider width={200} style={{ background: '#fff' }}>
                {this.chooseSystem(this.state.system, this.state.module)}
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 680 }}>
                  {this.chooseContent(this.state.features)}
                </Content>
              </Layout>
            </Layout>
          </Layout>;
  }
}
IndexContainer.propTypes = {
  user: PropTypes.object,
  system:PropTypes.string,
  module:PropTypes.string,
  features:PropTypes.string,
  data:PropTypes.array
};

function mapStateToProps(state) {
  return {
    user:state.index.user,
    system:state.index.system,
    module:state.index.module,
    features:state.index.features,
    data:state.index.data
  };
}

export default connect(mapStateToProps)(IndexContainer);
