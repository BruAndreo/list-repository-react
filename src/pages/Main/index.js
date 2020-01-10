import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import Container from '../../components/container';
import { Form, SubmitButton, List } from './styles';
import { Link } from 'react-router-dom';

import api from '../../services/api';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    searchError: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { newRepo, repositories } = this.state;

      if (repositories.find(i => i.name === newRepo)) {
        throw new Error('Repositório Duplicado');
      }

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        searchError: false,
      });
    }
    catch(err) {
      this.setState({ searchError: true });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { newRepo, repositories, loading, searchError } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={searchError}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            { loading ? (<FaSpinner color="#fff" size={14} />) : (<FaPlus color="#fff" size={14} />) }
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repo => (
            <li key={repo.name}>
              <span>{repo.name}</span>
              <Link to={`/repository/${encodeURIComponent(repo.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
