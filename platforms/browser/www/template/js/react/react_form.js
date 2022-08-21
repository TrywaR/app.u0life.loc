class FTTMsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      // table: '',
      app: 'app',
      action: 'clients',
      form: 'save',
      user_id: user.id,
      data: {},
      title: '',
      sort: '',
      active: false,
      submit: 'Submit',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // console.log('Change')
    // console.log(this.state)

    // console.log(event.target)
    // console.log(event.target.complete)
    // console.log(event.target.checked)

    // this.setState({value: event.target.value});
    if ( this.state.title != event.target.value ) {
      console.log('Title change')
    }

    this.setState({
      title: event.target.value,
      active: event.target.complete,
      sort: event.target.value,
      description: event.target.description
    });
  }

  handleSubmit(event) {
    // alert('Отправленное имя: ' + this.state.value);
    // console.log('send')
    // console.log('send')
    // console.log(this.state)
    // console.log(event)
    // console.log(event.state.value)
    // var oData = {
    //
    // }
    //
    // console.log('when')
    // console.log(this.state)

    $.when(
		  content_download( this.state, 'json' )
		).then( function( oData ){
      console.log( oData )
			// fttm_alerts( oData )
		})
    //
    event.preventDefault()
  }

  render() {
    // const {id, table, action, user_id, data, title, active, submit} = this.props

    return (
      <form onSubmit={this.handleSubmit}>
        <input type="hidden" name="id" value="{this.state.id}" />
        <input type="hidden" name="table" value="{this.state.table}" />
        <input type="hidden" name="user_id" value="{this.state.user_id}" />
        <input type="hidden" name="action" value="{this.state.action}" />

        <div className="row align-items-center mb-1">
          <div className="col-12 col-md-4">
            <label htmlFor="input_title" className="col-form-label">Title</label>
          </div>
          <div className="col-12 col-md-8">
            <input type="text" className="form-control" id="input_title" name="{this.state.title}" onChange={this.handleChange} />
          </div>
        </div>

        <div className="row align-items-center mb-1">
          <div className="col-12 col-md-4">
            <label htmlFor="input_sort" className="col-form-label">Sort</label>
          </div>
          <div className="col-12 col-md-8">
            <input type="number" className="form-control" id="input_sort" name="{this.state.sort}" onChange={this.handleChange} />
          </div>
        </div>

        <div className="row align-items-center mb-1">
          <div className="col-12 col-md-4">
            <label htmlFor="input_description">description</label>
          </div>
          <div className="col-12 col-md-8">
            <textarea className="form-control" id="input_description" rows="3">
              {this.state.description}
            </textarea>
          </div>
        </div>

        <div className="row align-items-center mb-1 mt-4">
          <div className="col-12 d-flex justify-content-end">
            <div className="form-check">
              <input className="form-check-input" defaultChecked="{this.state.active}" type="checkbox" id="input_active" name="active" onChange={this.handleChange} />
              <label className="form-check-label" htmlFor="input_active">
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn form_reset"><i className="fas fa-window-close"></i> Clear</button>
          <button type="submit" className="btn btn-primary"><i className="fas fa-plus-square"></i> {this.state.submit}</button>
        </div>
      </form>
    );
  }
}
