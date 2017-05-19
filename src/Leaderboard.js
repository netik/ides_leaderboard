import ReactTable from 'react-table'

class PlayerAvatar extends React.Component {
    render() { 
        let img='notset.png';

        switch(this.props.type) { 
        case 0:
            img='notset.png';
            break;
        case 1:
            img='guard.png';
            break;
        case 2:
            img='senator.png';
            break;
        case 3:
            img='gladiatrix.png';
            break;
        case 4:
            img='caesar.png';
            break;
         default:
            img='notset.png';
            break;
        }

        img = "/img/" + img;
        return <img height={55} border={0} src={img} align={"middle"} ></img>;
    }

}

const columns = [
    {
        // note the terrible hack here -- viewIndex is not always the actual index
        header: '',
        accessor: 'id',
        render: ({value, rowValues, row, index, viewIndex}) => viewIndex+1 + '.',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px', fontSize: '18px'},
        minWidth: 80
    },
    {
        header: '',
        accessor: 'ptype',
        render: ({value, rowValues, row, index, viewIndex}) => <PlayerAvatar type={value} />,
        style: {textAlign: 'center', verticalAlign: 'middle', lineHeight: '30px'},
    },
    {
        header: 'NAME',
        accessor: 'name',
        minWidth: 325,
        render: ({value, rowValues, row, index, viewIndex}) => {
            let ptype = "Unknown";
            switch(row.ptype) {
            case 1: 
              ptype = "Guard";
              break;
            case 2: 
              ptype = "Senator";
              break;
            case 3: 
              ptype = "Gladiatrix";
              break;
            case 4: 
              ptype = "Casear";
              break;
            }
            return (
                    <div>
                <span style={{fontSize: "18px", lineHeight:'20px'}}>{value}</span> <span style={{fontSize: "14px", paddingBottom: 30}}><br/>{ptype}<br/></span>
                    </div>
            )
        }, 
        style: {textAlign: 'left', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'LEVEL',
        accessor: 'plevel',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'XP',
        accessor: 'xp',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'WON',
        accessor: 'won',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'LOST',
        accessor: 'lost',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'AGL',
        accessor: 'agl',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    },
    {
        header: 'MIGHT',
        accessor: 'might',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '30px'}
    }
    ]


class Leaderboard extends React.Component {
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
        console.log("reload badges");
            $.ajax({
                    url: '/badges.json',
                        dataType: 'json',
                        success: function(data) {
                            let arr = [];
                            if (cb > 2) {
                                this.setState({data: this.filterData(cb-2, data)});
                                return;
                            }
                            this.setState({data: data});
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
        cb = cb + 1;
        if (cb > 5) { cb = 0;};
        this.setState({currentBoard: cb});

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
                        boardTitle: 'Most XP'});
            break;
        case 3:
            // best guard
            this.setState({
                    sortState:[{id: 'won', desc: true}],
                        boardTitle: 'Best Guards'});

            break;
        case 4:
            // best senators
            this.setState({
                    sortState:[{id: 'won', desc: true}],
                        boardTitle: 'Best Senators'});
            break;
        case 5:
            // best senators
            // best gladatrix
            this.setState({
                    sortState:[{id: 'won', desc: true}],
                        boardTitle: 'Best Gladiatrices'});
            break;
        }


    }
    constructor(props) {
        super(props);
        this.state = { 
            badges: [],
            sortState:[{
                    id: 'won',
                    desc: true
                }],
            boardTitle: 'Most Wins',
            currentBoard: 0
        };
        this.reloadBadges(0);
        this.changeContent = this.changeContent.bind(this);

        // change screens every five secs
        setInterval(this.changeContent, 5000);
    }
    
    render() {
        let counts = '';
        if (this.state.data) { 
            counts = <p><b>{this.state.data.length} badges seen.</b></p>;
        } else { 
            counts = "";
        }   

        return <div>
        <div className="page-header">
          <h1>Leaderboard - {this.state.boardTitle}</h1>
        </div>

        <ReactTable
            showPagination={false}
            data={this.state.data}
            defaultPageSize={10}
            columns={columns}
            headerStyle={{textAlign: 'center'}}
            sorting={this.state.sortState}
            getTrProps={(state, rowInfo, column) => {
                    // return an old-school "Stargate" style
                    // display. Leader in white, rest is in rainbows
                let delay = 0;

                if (rowInfo) { 
                    delay = (rowInfo.viewIndex % 3) * 0.1;
                    if (rowInfo.viewIndex == 0) { return {}; }
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
        </div>;
    }
}

export default Leaderboard

