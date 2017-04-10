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
        // 5 is bender, but we won't show that. 
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
        header: 'Rank',
        accessor: 'id',
        render: ({value, rowValues, row, index, viewIndex}) => viewIndex+1 + '.',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px', fontSize: '40px'},
        minWidth: 80
    },
    {
        header: '',
        accessor: 'ptype',
        render: ({value, rowValues, row, index, viewIndex}) => <PlayerAvatar type={value} />,
        style: {textAlign: 'center', verticalAlign: 'middle', lineHeight: '40px'},
    },
    {
        header: 'Name',
        accessor: 'name',
        minWidth: 250,
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
                    <span style={{fontSize: "40px"}}>{value}</span> <span style={{fontSize: "16px", padding: 0}}> - {ptype}</span>
                    </div>
            )
        }, 
        style: {textAlign: 'left', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'Level',
        accessor: 'plevel',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'XP',
        accessor: 'xp',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'Won',
        accessor: 'won',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'Lost',
        accessor: 'lost',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'Agility',
        accessor: 'agl',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    },
    {
        header: 'Might',
        accessor: 'might',
        style: {textAlign: 'right', verticalAlign: 'middle', lineHeight: '40px'}
    }
    ]


class Leaderboard extends React.Component {
    reloadBadges() {
        console.log("reload badges");
            $.ajax({
                    url: '/badges.json',
                        dataType: 'json',
                        success: function(data) {
                        this.setState({data: data});
                    }.bind(this),
                          error: function(xhr, status, err) {
                        console.error('reload fail');
                          }.bind(this)
                    });

    }
    changeContent(e) { 
        let cb = this.state.currentBoard;

        // rotate page
        cb = cb + 1;
        if (cb > 2) { cb = 0;};

        // reload our data
        this.reloadBadges();

        switch (cb) {
        case 0:
            // most wins
            this.setState({
                        sortState:[{id: 'won', desc: true}],
                        boardTitle: 'Most Wins',
                        currentBoard: cb});

            break;
        case 1:
            // most losses
            this.setState({
                    sortState:[{id: 'lost', desc: true}],
                        boardTitle: 'Most Losses',
                        currentBoard: cb});

            break;
        case 2:
            // most xp
            this.setState({
                    sortState:[{id: 'xp', desc: true}],
                        boardTitle: 'Most XP',
                        currentBoard: cb});

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
        this.reloadBadges();
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
            data={this.state.data}
            defaultPageSize={10}
            columns={columns}
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

