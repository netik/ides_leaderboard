import ReactTable from 'react-table'

const columns = [
  {
    // note the terrible hack here -- viewIndex is not always the actual index
    header: '',
    accessor: 'id',
    render: ({value, rowValues, row, index, viewIndex}) => viewIndex+1 + '.',
    style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px', fontSize: '30px'},
    minWidth: 80
  },
  {
    header: 'NAME',
    accessor: 'name',
    minWidth: 325,
    render: ({value, rowValues, row, index, viewIndex}) => {
      let fs = '30px';
      if (viewIndex == 0) {
        fs = '50px';
      }
      return (
        <div>
        <span style={{fontSize: fs, lineHeight:'30px'}}>{value}</span>
        </div>
      )
    },
    style: {textAlign: 'left', verticalAlign: 'middle', fontSize: "30px", lineHeight: '30px'}
  },
  {
    header: 'LEVEL',
    accessor: 'level',
    style: {textAlign: 'right', verticalAlign: 'middle',  fontSize: "30px", lineHeight: '30px'},
    render: ({value, rowValues, row, index, viewIndex}) => {
      let lvl = parseInt(value, 10) + 1;
      return (
        <div>{lvl}</div>
      )
    },
  },
  {
    header: 'XP',
    accessor: 'xp',
    style: {textAlign: 'right', verticalAlign: 'middle',  fontSize: "30px", lineHeight: '30px'}
  },
]


class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
      lastupdate: undefined,
      sortState:[{
        id: 'won',
        desc: true
      }],
      boardTitle: 'Top XP',
      currentBoard: 0
    };
    this.reloadBadges(0);
    this.changeContent = this.changeContent.bind(this);

    // change screens every five secs
    setInterval(this.changeContent, 5000);
  }

  filterData(ptype, data) {
    let res = [];

    if (data.length == 0) { return([]); }

    // filter an array based on type
    for (var i = 0; i < data.length; i++) {
      if (data[i].ptype == ptype) {
        res.push(data[i]);
      }
    }

    return res;
  }

  reloadBadges(cb) {
    //console.log("reload badges");
    $.ajax({
      url: '/badges.json',
      dataType: 'json',
      success: function(data) {
        let arr = [];
        if (cb > 2) {
          this.setState({data: this.filterData(cb-2, data)});
          return;
        }

        var dOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone: 'America/Los_Angeles'
        };

        this.setState({data: data});
        this.setState({
            lastupdate: new Date().toLocaleString('en-US', dOptions)
        });

        //console.log("loadok");
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('reload fail');
        this.setState({data: []});
      }.bind(this)
    });

  }
  changeContent(e) {
    let cb = this.state.currentBoard;

    // rotate page
  /*  cb = cb + 1;
    if (cb > 2) { cb = 0;};
    this.setState({currentBoard: cb});
 */
  cb = 2;
    // reload our data
    this.reloadBadges(cb);

    switch (cb) {
      case 0:
      // most wins
      this.setState({
        sortState:[{id: 'won', desc: true}],
        boardTitle: 'Most Wins'});

        break;
        case 1:
        // most losses
        this.setState({
          sortState:[{id: 'lost', desc: true}],
          boardTitle: 'Most Losses'});

          break;
          case 2:
          // most xp
          this.setState({
            sortState:[{id: 'xp', desc: true}],
            boardTitle: 'Top XP'});
            break;
          }
        }

        render() {
          let counts = '';
          let lu = '';

          if (this.state.data) {
            counts = <p><b>{this.state.data.length} badges seen.</b></p>;
          } else {
            counts = "";
          }

          return ( <div>
          <div className="page-header">
            <div className="row">
            <h1>DA BOMB Leaderboard - {this.state.boardTitle}</h1>
            </div>
            <div className="row">
              <h3 className="pull-right">
                {this.state.lastupdate}
              </h3>
            </div>
            </div>

          <ReactTable
              showPagination={false}
              data={this.state.data}
              defaultPageSize={10}
              columns={columns}
              headerStyle={{textAlign: 'center', color: 'White'}}
              sorting={this.state.sortState}
              getTrProps={(state, rowInfo, column) => {
                // return an old-school "Stargate" style
                // display. Leader in white, rest is in rainbows
                let delay = 0;

                if (rowInfo) {
                  delay = (rowInfo.viewIndex % 3) * 0.1;
                  if (rowInfo.viewIndex == 0 && column == 0) {
                    return {style: { fontSize: '40px' } }
                  }
                  if (rowInfo.viewIndex != 0) { return {style: { color: 'Red' } } }
                }

                return {
                  style: {
                    animation: 'super-rainbow 3s linear 0s infinite',
                    animationDelay: delay + "s"
                  }
                }
              }}
          />
          {counts}
          </div>);
        }
      }

      export default Leaderboard
