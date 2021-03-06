import { Table, Popconfirm } from 'antd';
import EditableCell from '../EditableCell';
import NavParentCell from '../nav/NavParentCell';
import { dataToEditableData, editableDataToData } from '../../utils/DataFormatter';

class QueryArticleSeriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'ID',
      dataIndex: 'id',
      key:'id',
      render: (text, record, index) => (text),
    },{
      title: '系列名称',
      dataIndex: 'name',
      key:'name',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
    }, {
      title: '描述',
      dataIndex: 'description',
      key:'description',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'description', text),
    }, {
      title: '状态',
      dataIndex: 'state',
      key:'state',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'state', text),
    }, {
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].state;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>&nbsp;&nbsp;
                  <Popconfirm title="确定取消吗?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                </span>
            }
          </div>
        );
      },
    }];
    this.state = {
      data:props.data
    };
  }
  componentWillReceiveProps(props){
    this.setState({data:props.data});
  }
  renderColumns(data, index, key, text) {
    const { editable, status } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />);
  }
  handleChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }
  edit(index) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data });
  }
  editDone(index, type) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });
      this.props.saveArticleSeries(editableDataToData(data[index]));
    });
  }
  render() {
    const { data } = this.state;
    console.log(data);
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;
    const pagination = {pageSize:100}
    return <Table bordered pagination={pagination} dataSource={dataSource} columns={columns}  rowKey="id"/>;
  }
}

export default QueryArticleSeriesTable;